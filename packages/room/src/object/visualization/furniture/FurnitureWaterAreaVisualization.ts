import { IGraphicAsset, RoomObjectVariable } from '@octane/api';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';
import { ShoreAlphaMask, ShoreMaskCreatorUtility } from './ShoreMaskCreatorUtility';

export type ShoreBorders = { borders: boolean[], borderTypes: number[] };

export class FurnitureWaterAreaVisualization extends FurnitureAnimatedVisualization
{
    private static readonly SHORE_SPRITE_TAG: string = 'shore';

    private _hasShore: boolean = true;
    private _borders: boolean[] = [];
    private _borderTypes: number[] = [];
    private _createdInstanceMaskSizes: number[] = [];
    private _needsShoreUpdate: boolean = false;
    private _sizeX: number = 0;
    private _sizeY: number = 0;
    private _shoreSpriteIndex: number = -1;
    private _shoreSpriteIndexScale: number = -1;
    private _shoreSpriteIndexDirection: number = -1;
    private _shoreMask: ShoreAlphaMask = null;

    public dispose(): void
    {
        const collection = this.asset;

        if(collection && this.object)
        {
            for(const size of this._createdInstanceMaskSizes) ShoreMaskCreatorUtility.disposeInstanceMask(this.object.instanceId, size, collection);
        }

        this._createdInstanceMaskSizes = [];
        this._shoreMask = null;

        super.dispose();
    }

    protected updateObject(scale: number, direction: number): boolean
    {
        if(!super.updateObject(scale, direction)) return false;

        this.updateBorderData();

        this._needsShoreUpdate = this.isMaskable;

        return true;
    }

    protected updateAnimation(scale: number): number
    {
        let update = super.updateAnimation(scale);

        if(this.updateInstanceShoreMask(scale)) update |= (1 << this.getShoreSpriteIndex(scale));

        return update;
    }

    protected getSpriteAssetName(scale: number, layerId: number): string
    {
        if(!this.isMaskable || (scale === 1) || (layerId !== this.getShoreSpriteIndex(scale))) return super.getSpriteAssetName(scale, layerId);

        if(!this._hasShore) return '';

        const name = ShoreMaskCreatorUtility.getInstanceMaskName(this.object.instanceId, this.getValidSize(scale));

        // Until the instance mask is drawn the shared shore stands in.
        return this.asset?.getAsset(name) ? name : super.getSpriteAssetName(scale, layerId);
    }

    /** The state is the neighbour mask, not an animation: water always plays the first one. */
    protected setAnimation(_animationId: number): void
    {
        super.setAnimation(0);
    }

    private get isMaskable(): boolean
    {
        return (this._sizeX === 2) && (this._sizeY === 2);
    }

    private getShoreSpriteIndex(scale: number): number
    {
        if((this._shoreSpriteIndexScale === scale) && (this._shoreSpriteIndexDirection === this._direction)) return this._shoreSpriteIndex;

        this._shoreSpriteIndex = -1;
        this._shoreSpriteIndexScale = scale;
        this._shoreSpriteIndexDirection = this._direction;

        for(let layerId = this.totalSprites - 1; layerId >= 0; layerId--)
        {
            if(this.getLayerTag(scale, this._direction, layerId) !== FurnitureWaterAreaVisualization.SHORE_SPRITE_TAG) continue;

            this._shoreSpriteIndex = layerId;

            break;
        }

        return this._shoreSpriteIndex;
    }

    private getShoreAsset(scale: number): IGraphicAsset
    {
        const layerId = this.getShoreSpriteIndex(scale);

        if(layerId < 0) return null;

        return this.asset?.getAsset(super.getSpriteAssetName(scale, layerId)) ?? null;
    }

    private updateBorderData(): void
    {
        if(!this._sizeX || !this._sizeY)
        {
            const model = this.object?.model;

            if(!model) return;

            this._sizeX = Math.trunc(model.getValue<number>(RoomObjectVariable.FURNITURE_SIZE_X) ?? 0);
            this._sizeY = Math.trunc(model.getValue<number>(RoomObjectVariable.FURNITURE_SIZE_Y) ?? 0);
        }

        const shore = FurnitureWaterAreaVisualization.computeShoreBorders(this.object.getState(0), this._sizeX, this._sizeY);

        this._borders = shore.borders;
        this._borderTypes = shore.borderTypes;
        this._hasShore = this._borders.some(border => border);
    }

    private updateInstanceShoreMask(scale: number): boolean
    {
        if(!this._needsShoreUpdate || (scale === 1)) return false;

        const collection = this.asset;
        const shore = this.getShoreAsset(scale);

        if(!collection || !shore?.texture) return false;

        const size = this.getValidSize(scale);
        const instanceMask = ShoreMaskCreatorUtility.getInstanceMask(this.object.instanceId, size, collection, shore);

        if(!instanceMask?.texture) return false;

        if(this._createdInstanceMaskSizes.indexOf(size) < 0) this._createdInstanceMaskSizes.push(size);

        if(!ShoreMaskCreatorUtility.initializeShoreMasks(size, collection, shore)) return false;

        const width = instanceMask.texture.width;
        const height = instanceMask.texture.height;

        if(!this._shoreMask || (this._shoreMask.width !== width) || (this._shoreMask.height !== height)) this._shoreMask = ShoreMaskCreatorUtility.createEmptyMask(width, height);

        ShoreMaskCreatorUtility.createShoreMask2x2(this._shoreMask, size, this._borders, this._borderTypes, collection);

        this._needsShoreUpdate = false;

        // Cannot draw here (no 2d canvas or readback): drop the empty mask so the full shore shows.
        if(!ShoreMaskCreatorUtility.drawInstanceMask(instanceMask, shore, this._shoreMask))
        {
            ShoreMaskCreatorUtility.disposeInstanceMask(this.object.instanceId, size, collection);

            this._createdInstanceMaskSizes = this._createdInstanceMaskSizes.filter(created => (created !== size));
        }

        return true;
    }

    /** Which shore segments show (clockwise from the top) and how each one's ends are cut. */
    public static computeShoreBorders(state: number, sizeX: number, sizeY: number): ShoreBorders
    {
        const borders: boolean[] = [];
        const borderTypes: number[] = [];

        if((sizeX <= 0) || (sizeY <= 0)) return { borders, borderTypes };

        const width = sizeX + 2;
        const height = sizeY + 2;
        const area: boolean[][] = [];

        for(let y = 0; y < height; y++) area.push(new Array<boolean>(width).fill((y > 0) && (y < height - 1)));

        for(let y = 1; y < height - 1; y++)
        {
            area[y][0] = false;
            area[y][width - 1] = false;
        }

        state = (state | 0);

        const take = (): boolean =>
        {
            const water = ((state & 1) !== 0);

            state >>= 1;

            return water;
        };

        for(let x = width - 1; x >= 0; x--) if(take()) area[height - 1][x] = true;

        for(let y = height - 2; y >= 1; y--)
        {
            if(take()) area[y][width - 1] = true;
            if(take()) area[y][0] = true;
        }

        for(let x = width - 1; x >= 0; x--) if(take()) area[0][x] = true;

        const cut = (across: boolean, beside: boolean): number =>
        {
            if(!across && !beside) return ShoreMaskCreatorUtility.NO_CUT;

            return beside ? ShoreMaskCreatorUtility.INNER_CUT : ShoreMaskCreatorUtility.STRAIGHT_CUT;
        };

        const add = (shown: boolean, start: number, end: number): void =>
        {
            borders.push(shown);
            borderTypes.push(shown ? ShoreMaskCreatorUtility.getBorderType(start, end) : ShoreMaskCreatorUtility.STRAIGHT_CUT);
        };

        // Top, left to right.
        for(let x = 1; x < width - 1; x++)
        {
            add(!area[0][x], cut(area[1][x - 1], area[0][x - 1]), cut(area[1][x + 1], area[0][x + 1]));
        }

        // Right, top to bottom.
        for(let y = 1; y < height - 1; y++)
        {
            add(!area[y][width - 1], cut(area[y - 1][width - 2], area[y - 1][width - 1]), cut(area[y + 1][width - 2], area[y + 1][width - 1]));
        }

        // Bottom, right to left.
        for(let x = width - 2; x >= 1; x--)
        {
            add(!area[height - 1][x], cut(area[height - 2][x + 1], area[height - 1][x + 1]), cut(area[height - 2][x - 1], area[height - 1][x - 1]));
        }

        // Left, bottom to top.
        for(let y = height - 2; y >= 1; y--)
        {
            add(!area[y][0], cut(area[y + 1][1], area[y + 1][0]), cut(area[y - 1][1], area[y - 1][0]));
        }

        return { borders, borderTypes };
    }
}
