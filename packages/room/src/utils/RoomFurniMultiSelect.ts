import { IRoomObject, IRoomObjectController, RoomObjectCategory, RoomObjectVariable } from '@octane/api';
import { GetCommunication, MoveFurniGroupComposer } from '@octane/communication';
import { RoomObjectMouseEvent, RoomObjectTileMouseEvent } from '@octane/events';
import { Vector3d } from '@octane/utils';
import { ColorMatrixFilter } from 'pixi.js';

/** Ce dont le gestionnaire a besoin du moteur (evite l'import circulaire de RoomEngine). */
export interface IFurniMultiSelectEngine
{
    readonly activeRoomId: number;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjects(roomId: number, category: number): IRoomObject[];
    getRoomObjectCategoryForType(type: string): number;
}

export type FurniMultiSelectListener = (state: { active: boolean; count: number; dragging: boolean }) => void;

interface TilePoint { x: number; y: number; }

/**
 * BobbaTok : selection multiple de mobis au sol.
 *
 * Mode dedie (active / desactive par le client) : tant qu'il est allume, la souris ne fait plus marcher l'avatar ni
 * ouvrir l'infostand, et le deplacement classique d'un mobi n'est pas touche quand il est eteint.
 *  - clic sur un mobi : l'ajoute ou le retire ;
 *  - Alt + clic : toute la pile de la case ;
 *  - glisser sur le sol : rectangle (Shift / Ctrl = ajouter a la selection, sinon la remplace) ; clic dans le vide = tout deselectionner ;
 *  - appuyer sur un mobi selectionne puis glisser : tout le groupe suit la souris (apercu), le clic / lacher envoie
 *    le deplacement au serveur (MoveFurniGroupComposer, tout ou rien). Echap annule.
 */
export class RoomFurniMultiSelect
{
    public static readonly MAX_SELECTION = 300;
    public static readonly SELECTION_COLOR = 0x4fbce3;

    private static _rectFilter: ColorMatrixFilter = null;

    private _engine: IFurniMultiSelectEngine;
    private _active: boolean = false;
    private _roomId: number = -1;
    private _selected: Set<number> = new Set();
    private _listener: FurniMultiSelectListener = null;

    // glisser du groupe
    private _pressedId: number = -1;
    private _pressTile: TilePoint = null;
    private _dragging: boolean = false;
    private _dx: number = 0;
    private _dy: number = 0;
    private _origins: Map<number, { location: Vector3d; alpha: number; clickThrough: number }> = new Map();

    // rectangle
    private _rectStart: TilePoint = null;
    private _rectEnd: TilePoint = null;
    private _rectAdd: boolean = false;

    constructor(engine: IFurniMultiSelectEngine)
    {
        this._engine = engine;
    }

    public get active(): boolean { return this._active; }
    public get dragging(): boolean { return this._dragging; }
    public get selectedIds(): number[] { return Array.from(this._selected); }

    public set listener(listener: FurniMultiSelectListener) { this._listener = listener; }

    public setActive(active: boolean): void
    {
        if(active === this._active) return;

        if(active)
        {
            this._active = true;
            this._roomId = this._engine.activeRoomId;
        }
        else
        {
            this.cancelDrag();
            this.clearRect();
            this.clear(false);
            this._active = false;
            this._roomId = -1;
        }

        this.notify();
    }

    /** Le moteur change de piece : on repart de zero. */
    public onRoomChanged(): void
    {
        if(!this._active) return;

        this.setActive(false);
    }

    public clear(notify: boolean = true): void
    {
        for(const id of this._selected) this.setHighlighted(id, false);

        this._selected.clear();

        if(notify) this.notify();
    }

    public cancelDrag(): boolean
    {
        if(!this._dragging && (this._pressedId < 0)) return false;

        if(this._dragging) this.restoreOrigins();

        this._dragging = false;
        this._pressedId = -1;
        this._pressTile = null;
        this._dx = 0;
        this._dy = 0;
        this.notify();

        return true;
    }

    /** Appele par RoomObjectEventHandler pour chaque evenement souris. true = consomme (rien d'autre ne se passe). */
    public handleMouseEvent(event: RoomObjectMouseEvent, roomId: number): boolean
    {
        if(!this._active || !event) return false;

        if(roomId !== this._roomId)
        {
            this.setActive(false);

            return false;
        }

        const category = this._engine.getRoomObjectCategoryForType(event.objectType);
        const isTile = (event instanceof RoomObjectTileMouseEvent);
        const isFloorFurni = (category === RoomObjectCategory.FLOOR);

        switch(event.type)
        {
            case RoomObjectMouseEvent.MOUSE_DOWN:
                if(isFloorFurni && this._selected.has(event.objectId))
                {
                    const tile = this.objectTile(event.objectId);

                    if(tile)
                    {
                        this._pressedId = event.objectId;
                        this._pressTile = tile;
                        this._dragging = false;
                    }

                    return true;
                }

                if(isTile)
                {
                    const tile = { x: (event as RoomObjectTileMouseEvent).tileXAsInt, y: (event as RoomObjectTileMouseEvent).tileYAsInt };

                    this._rectStart = tile;
                    this._rectEnd = tile;
                    this._rectAdd = (event.shiftKey || event.ctrlKey);
                }

                return true;

            case RoomObjectMouseEvent.MOUSE_MOVE:
            {
                if(this._pressedId >= 0)
                {
                    const tile = this.eventTile(event, isTile, isFloorFurni);

                    if(tile && this._pressTile)
                    {
                        const dx = (tile.x - this._pressTile.x);
                        const dy = (tile.y - this._pressTile.y);

                        if(!this._dragging && (dx || dy) && event.buttonDown !== false) this.startDrag();

                        if(this._dragging && ((dx !== this._dx) || (dy !== this._dy))) this.preview(dx, dy);
                    }

                    return true;
                }

                if(this._rectStart)
                {
                    const tile = this.eventTile(event, isTile, isFloorFurni);

                    if(tile && ((tile.x !== this._rectEnd.x) || (tile.y !== this._rectEnd.y)))
                    {
                        this._rectEnd = tile;
                        this.drawRect();
                    }

                    return true;
                }

                // rien en cours : on laisse le curseur de case se mettre a jour (aucune action n'en decoule)
                return false;
            }

            case RoomObjectMouseEvent.CLICK:
            {
                if(this._dragging)
                {
                    this.commitDrag();

                    return true;
                }

                if(this._pressedId >= 0)
                {
                    // clic sans glisser sur un mobi deja selectionne : on le retire (Alt : toute sa pile)
                    const pressed = this._pressedId;

                    this._pressedId = -1;
                    this._pressTile = null;

                    if(event.altKey) this.toggleStack(pressed, false);
                    else this.toggle(pressed);

                    return true;
                }

                if(this._rectStart)
                {
                    const start = this._rectStart;
                    const end = this._rectEnd || start;
                    const single = ((start.x === end.x) && (start.y === end.y));
                    const add = this._rectAdd;

                    this.clearRect();

                    if(!single)
                    {
                        this.selectRect(start, end, add);

                        return true;
                    }

                    if(!isFloorFurni)
                    {
                        if(!add) this.clear();

                        return true;
                    }
                }

                if(isFloorFurni)
                {
                    if(event.altKey) this.toggleStack(event.objectId, true);
                    else this.toggle(event.objectId);
                }

                return true;
            }

            case RoomObjectMouseEvent.DOUBLE_CLICK:
            case RoomObjectMouseEvent.MOUSE_DOWN_LONG:
                return true;
        }

        return false;
    }

    // ── selection ──

    private toggle(objectId: number): void
    {
        if(this._selected.has(objectId))
        {
            this._selected.delete(objectId);
            this.setHighlighted(objectId, false);
        }
        else if(this._selected.size < RoomFurniMultiSelect.MAX_SELECTION && this.getFloorObject(objectId))
        {
            this._selected.add(objectId);
            this.setHighlighted(objectId, true);
        }

        this.notify();
    }

    /** Alt + clic : toute la pile de la case du mobi (select = true ajoute, false retire). */
    private toggleStack(objectId: number, select: boolean): void
    {
        const tile = this.objectTile(objectId);

        if(!tile) return;

        const stack = this.floorObjects().filter(object => this.footprintContains(object, tile.x, tile.y));
        const allSelected = stack.every(object => this._selected.has(object.id));
        const add = select && !allSelected;

        for(const object of stack)
        {
            if(add)
            {
                if(this._selected.size >= RoomFurniMultiSelect.MAX_SELECTION) break;

                this._selected.add(object.id);
                this.setHighlighted(object.id, true);
            }
            else
            {
                this._selected.delete(object.id);
                this.setHighlighted(object.id, false);
            }
        }

        this.notify();
    }

    private selectRect(start: TilePoint, end: TilePoint, add: boolean): void
    {
        const minX = Math.min(start.x, end.x), maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y), maxY = Math.max(start.y, end.y);

        if(!add) this.clear(false);

        for(const object of this.floorObjects())
        {
            if(this._selected.size >= RoomFurniMultiSelect.MAX_SELECTION) break;

            const location = object.getLocation();
            const x = Math.round(location.x), y = Math.round(location.y);

            if((x < minX) || (x > maxX) || (y < minY) || (y > maxY)) continue;

            this._selected.add(object.id);
            this.setHighlighted(object.id, true);
        }

        this.notify();
    }

    private setHighlighted(objectId: number, value: boolean): void
    {
        const object = this.getFloorObject(objectId);

        if(!object || !object.model) return;

        object.model.setValue(RoomObjectVariable.FURNITURE_MULTI_SELECTED, value ? 1 : 0);
    }

    /** Retire de la selection les mobis qui ont disparu (ramasses, supprimes). */
    private prune(): void
    {
        for(const id of Array.from(this._selected))
        {
            if(!this.getFloorObject(id)) this._selected.delete(id);
        }
    }

    // ── glisser du groupe ──

    private startDrag(): void
    {
        this.prune();

        if(!this._selected.size) return;

        this._origins.clear();

        for(const id of this._selected)
        {
            const object = this.getFloorObject(id);

            if(!object || !object.model) continue;

            const location = object.getLocation();

            this._origins.set(id, {
                location: new Vector3d(location.x, location.y, location.z),
                alpha: object.model.getValue<number>(RoomObjectVariable.FURNITURE_ALPHA_MULTIPLIER),
                clickThrough: object.model.getValue<number>(RoomObjectVariable.FURNITURE_WIRED_CLICK_THROUGH)
            });

            // a moitie transparent et traversable : la souris vise les cases en dessous pendant le glisser
            object.model.setValue(RoomObjectVariable.FURNITURE_ALPHA_MULTIPLIER, 0.5);
            object.model.setValue(RoomObjectVariable.FURNITURE_WIRED_CLICK_THROUGH, 1);
        }

        this.clearRect();
        this._dragging = true;
        this._dx = 0;
        this._dy = 0;
        this.notify();
    }

    private preview(dx: number, dy: number): void
    {
        this._dx = dx;
        this._dy = dy;

        this.drawLanding(dx, dy);

        for(const [ id, origin ] of this._origins)
        {
            const object = this.getFloorObject(id);

            if(!object) continue;

            object.setLocation(new Vector3d(origin.location.x + dx, origin.location.y + dy, origin.location.z));
        }
    }

    /** Pendant le glisser : la zone ou le groupe va se poser, en vert (meme rendu que les zones des wireds). */
    private drawLanding(dx: number, dy: number): void
    {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        for(const [ id, origin ] of this._origins)
        {
            const object = this.getFloorObject(id);

            if(!object) continue;

            const size = this.footprintSize(object);
            const x = Math.round(origin.location.x) + dx, y = Math.round(origin.location.y) + dy;

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + size.x - 1);
            maxY = Math.max(maxY, y + size.y - 1);
        }

        if(!isFinite(minX)) return;

        const room = this._engine.getRoomObject(this._roomId, -1, RoomObjectCategory.ROOM);
        const visualization = room && (room.visualization as unknown as { initializeHighlightArea?: (x: number, y: number, w: number, h: number, filter: ColorMatrixFilter) => void });

        visualization?.initializeHighlightArea?.(minX, minY, (maxX - minX) + 1, (maxY - minY) + 1, RoomFurniMultiSelect.landingFilter());
    }

    private restoreOrigins(): void
    {
        this.clearRect();

        for(const [ id, origin ] of this._origins)
        {
            const object = this.getFloorObject(id);

            if(!object || !object.model) continue;

            object.setLocation(origin.location);
            object.model.setValue(RoomObjectVariable.FURNITURE_ALPHA_MULTIPLIER, (origin.alpha === undefined) ? 1 : origin.alpha);
            object.model.setValue(RoomObjectVariable.FURNITURE_WIRED_CLICK_THROUGH, origin.clickThrough || 0);
        }

        this._origins.clear();
    }

    private commitDrag(): void
    {
        const dx = this._dx;
        const dy = this._dy;
        const ids = Array.from(this._origins.keys());

        // retour a la place d'origine : le serveur fait glisser le groupe (ou le laisse en place s'il refuse)
        this.restoreOrigins();

        this._dragging = false;
        this._pressedId = -1;
        this._pressTile = null;
        this._dx = 0;
        this._dy = 0;

        if(ids.length && (dx || dy))
        {
            GetCommunication()?.connection?.send(new MoveFurniGroupComposer(ids, dx, dy));

            // comme un deplacement classique : une fois le groupe pose, le mode s'eteint
            this.setActive(false);

            return;
        }

        this.notify();
    }

    // ── rectangle ──

    private drawRect(): void
    {
        if(!this._rectStart || !this._rectEnd) return;

        const room = this._engine.getRoomObject(this._roomId, -1, RoomObjectCategory.ROOM);
        const visualization = room && (room.visualization as unknown as { initializeHighlightArea?: (x: number, y: number, w: number, h: number, filter: ColorMatrixFilter) => void });

        if(!visualization?.initializeHighlightArea) return;

        const minX = Math.min(this._rectStart.x, this._rectEnd.x), minY = Math.min(this._rectStart.y, this._rectEnd.y);
        const width = Math.abs(this._rectEnd.x - this._rectStart.x) + 1;
        const height = Math.abs(this._rectEnd.y - this._rectStart.y) + 1;

        visualization.initializeHighlightArea(minX, minY, width, height, RoomFurniMultiSelect.rectFilter());
    }

    private clearRect(): void
    {
        this._rectStart = null;
        this._rectEnd = null;
        this._rectAdd = false;

        const room = this._engine.getRoomObject(this._roomId, -1, RoomObjectCategory.ROOM);
        const visualization = room && (room.visualization as unknown as { clearHighlightArea?: () => void });

        visualization?.clearHighlightArea?.();
    }

    private static rectFilter(): ColorMatrixFilter
    {
        if(!RoomFurniMultiSelect._rectFilter)
        {
            const filter = new ColorMatrixFilter();

            // meme teinte que RoomAreaSelectionManager.HIGHLIGHT_BLUE (zones des wireds)
            filter.matrix = [
                1.05, 0, 0, 0,
                0, 1.3, 0, 0,
                0, 0, 1.8, 0,
                0, 0, 0, 1,
                0, 0.0314, 0.0784, 0 ];

            RoomFurniMultiSelect._rectFilter = filter;
        }

        return RoomFurniMultiSelect._rectFilter;
    }

    private static _landingFilter: ColorMatrixFilter = null;

    private static landingFilter(): ColorMatrixFilter
    {
        if(!RoomFurniMultiSelect._landingFilter)
        {
            const filter = new ColorMatrixFilter();

            // RoomAreaSelectionManager.HIGHLIGHT_GREEN
            filter.matrix = [
                0.5, 0, 0, 0,
                0, 1.6, 0, 0,
                0, 0, 0.5, 0,
                0, 0, 0, 1,
                0, 0.15, 0, 0 ];

            RoomFurniMultiSelect._landingFilter = filter;
        }

        return RoomFurniMultiSelect._landingFilter;
    }

    // ── outils ──

    private notify(): void
    {
        if(this._listener) this._listener({ active: this._active, count: this._selected.size, dragging: this._dragging });
    }

    private floorObjects(): IRoomObject[]
    {
        if(this._roomId < 0) return [];

        return (this._engine.getRoomObjects(this._roomId, RoomObjectCategory.FLOOR) || []);
    }

    private getFloorObject(objectId: number): IRoomObjectController
    {
        if(this._roomId < 0) return null;

        return this._engine.getRoomObject(this._roomId, objectId, RoomObjectCategory.FLOOR);
    }

    private objectTile(objectId: number): TilePoint
    {
        const object = this.getFloorObject(objectId);

        if(!object) return null;

        const location = object.getLocation();

        return { x: Math.round(location.x), y: Math.round(location.y) };
    }

    private eventTile(event: RoomObjectMouseEvent, isTile: boolean, isFloorFurni: boolean): TilePoint
    {
        if(isTile) return { x: (event as RoomObjectTileMouseEvent).tileXAsInt, y: (event as RoomObjectTileMouseEvent).tileYAsInt };

        if(isFloorFurni && !this._origins.has(event.objectId)) return this.objectTile(event.objectId);

        return null;
    }

    private footprintSize(object: IRoomObject): { x: number; y: number }
    {
        const model = object.model;
        let sizeX = Math.max(1, (model && model.getValue<number>(RoomObjectVariable.FURNITURE_SIZE_X)) || 1);
        let sizeY = Math.max(1, (model && model.getValue<number>(RoomObjectVariable.FURNITURE_SIZE_Y)) || 1);
        const direction = Math.round(((object.getDirection()?.x || 0) % 360) / 45);

        if((direction === 2) || (direction === 6))
        {
            const swap = sizeX;

            sizeX = sizeY;
            sizeY = swap;
        }

        return { x: sizeX, y: sizeY };
    }

    private footprintContains(object: IRoomObject, x: number, y: number): boolean
    {
        const location = object.getLocation();
        const size = this.footprintSize(object);
        const ox = Math.round(location.x), oy = Math.round(location.y);

        return (x >= ox) && (x < (ox + size.x)) && (y >= oy) && (y < (oy + size.y));
    }
}
