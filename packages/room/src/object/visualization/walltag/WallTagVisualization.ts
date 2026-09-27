import { AlphaTolerance, IObjectVisualizationData, IRoomGeometry, RoomObjectVariable } from '@octane/api';
import { Vector3d } from '@octane/utils';
import { Texture } from 'pixi.js';
import { GetRoomEngine } from '../../../GetRoomEngine';
import { RoomObjectSpriteVisualization } from '../RoomObjectSpriteVisualization';

interface WallTagDrop
{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    delay: number;
    tint: number;
}

/**
 * BobbaTok : tag (graffiti) sur un mur. Le PNG recu de l'emulateur est incline pour suivre le mur
 * (comme les photos), puis revele avec une animation "bombe de peinture" : la peinture apparait par
 * taches depuis le centre pendant qu'une nuee de gouttelettes de la couleur du tag gicle autour.
 */
export class WallTagVisualization extends RoomObjectSpriteVisualization
{
    public static REVEAL_MS: number = 1150;
    public static DROP_COUNT: number = 16;
    private static SKEW: number = 0.5;
    private static _dropTexture: Texture = null;

    private _dataKey: string = null;
    private _image: CanvasImageSource = null;
    private _previewTick: number = -1;
    private _hidden: boolean = false;
    private _imageReady: boolean = false;
    private _width: number = 0;
    private _height: number = 0;
    private _direction: number = 0;
    private _canvasWidth: number = 0;
    private _canvasHeight: number = 0;
    private _finalTexture: Texture = null;
    private _workCanvas: HTMLCanvasElement = null;
    private _workTexture: Texture = null;
    private _blobs: { dx: number; dy: number; scale: number }[] = [];
    private _tint: number = 0xFFFFFF;
    /** Colonne de la porte a ne pas peindre (px de la toile), calculee depuis la geometrie de la piece. */
    private _doorCut: { x: number; width: number } = null;
    private _doorChecked: boolean = false;

    private _animatePending: boolean = false;
    private _revealStart: number = -1;
    private _drops: WallTagDrop[] = [];
    private _needsSpriteUpdate: boolean = true;
    private _lastScale: number = -1;

    public initialize(data: IObjectVisualizationData): boolean
    {
        this.createSprites(1 + WallTagVisualization.DROP_COUNT);

        return true;
    }

    public dispose(): void
    {
        this.destroyTextures();

        this._image = null;

        super.dispose();
    }

    private destroyTextures(): void
    {
        if(this._finalTexture)
        {
            this._finalTexture.destroy(true);
            this._finalTexture = null;
        }

        if(this._workTexture)
        {
            this._workTexture.destroy(true);
            this._workTexture = null;
        }

        this._workCanvas = null;
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        if(!this.object || !this.object.model || !geometry) return;

        const model = this.object.model;

        // Cache pendant l'edition du mur (le tag est dans la toile d'apercu).
        const hidden = (model.getValue<number>(RoomObjectVariable.WALL_TAG_HIDDEN) === 1);

        if(hidden !== this._hidden)
        {
            this._hidden = hidden;
            this._needsSpriteUpdate = true;
        }

        // Apercu en direct : la toile du client est la source, redessinee a chaque changement.
        if(model.getValue<number>(RoomObjectVariable.WALL_TAG_PREVIEW) === 1)
        {
            const tick = (model.getValue<number>(RoomObjectVariable.WALL_TAG_PREVIEW_TICK) || 0);
            const canvas = model.getValue<HTMLCanvasElement>(RoomObjectVariable.WALL_TAG_PREVIEW_CANVAS);

            if(canvas && (tick !== this._previewTick))
            {
                this._previewTick = tick;
                this._image = canvas;
                this._width = (model.getValue<number>(RoomObjectVariable.WALL_TAG_WIDTH) || canvas.width);
                this._height = (model.getValue<number>(RoomObjectVariable.WALL_TAG_HEIGHT) || canvas.height);
                this._imageReady = true;
                this._dataKey = 'preview';

                if(this._finalTexture && (this._canvasWidth === this._width)) this.redrawFinal();
                else this.buildTextures();

                this._needsSpriteUpdate = true;
            }
        }

        const data = model.getValue<string>(RoomObjectVariable.WALL_TAG_DATA);

        if(data && (data !== this._dataKey))
        {
            this._dataKey = data;
            this._width = (model.getValue<number>(RoomObjectVariable.WALL_TAG_WIDTH) || 0);
            this._height = (model.getValue<number>(RoomObjectVariable.WALL_TAG_HEIGHT) || 0);
            this._animatePending = (model.getValue<number>(RoomObjectVariable.WALL_TAG_ANIMATE) === 1);

            this.loadImage(data);
        }

        const direction = this.object.getDirection().x;

        if(direction !== this._direction)
        {
            this._direction = direction;

            this._doorChecked = false;

            if(this._imageReady) this.buildTextures();
        }

        if(this._imageReady && !this._doorChecked) this.updateDoorCut(geometry);

        if(this._imageReady && this._animatePending)
        {
            this._animatePending = false;
            this.startReveal(time);
        }

        if(this._revealStart >= 0)
        {
            this.renderReveal(time);
            this._needsSpriteUpdate = true;
        }

        if(geometry.scale !== this._lastScale)
        {
            this._lastScale = geometry.scale;
            this._needsSpriteUpdate = true;
        }

        if(this._needsSpriteUpdate)
        {
            this.updateSprites(geometry.scale, time);
            this._needsSpriteUpdate = false;
            this.updateSpriteCounter++;
        }
    }

    private loadImage(data: string): void
    {
        if((typeof Image === 'undefined') || !data) return;

        this._imageReady = false;
        this.destroyTextures();

        const image = new Image();
        const key = data;

        image.onload = () =>
        {
            if(this._dataKey !== key) return;

            this._image = image;
            this._imageReady = true;

            if(!this._width) this._width = image.width;
            if(!this._height) this._height = image.height;

            this._tint = WallTagVisualization.averageColor(image);

            this.buildTextures();
            this._needsSpriteUpdate = true;
        };

        image.onerror = () =>
        {
            this._image = null;
            this._imageReady = false;
        };

        // PNG (iVBORw0KGgo) ou WebP (UklGR = RIFF) : le format est detecte sur le contenu.
        image.src = ((data.indexOf('UklGR') === 0) ? 'data:image/webp;base64,' : 'data:image/png;base64,') + data;
    }

    private get skew(): number
    {
        // Mur de droite (direction 180, 'r') : descend vers la droite ; mur de gauche ('l') : monte.
        return (this._direction === 180) ? WallTagVisualization.SKEW : -WallTagVisualization.SKEW;
    }

    private drawSkewedImage(ctx: CanvasRenderingContext2D): void
    {
        const skew = this.skew;
        const offsetY = (skew < 0) ? (this._width * WallTagVisualization.SKEW) : 0;

        ctx.save();
        ctx.setTransform(1, skew, 0, 1, 0, offsetY);
        ctx.drawImage(this._image, 0, 0, this._width, this._height);
        ctx.restore();

        // La porte est un trou dans le mur : on n'y laisse jamais de peinture.
        if(this._doorCut && (this._doorCut.width > 0))
        {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(this._doorCut.x, 0, this._doorCut.width, this._canvasHeight);
            ctx.restore();
        }
    }

    /**
     * Cherche la porte de la piece a l'ecran : si elle est sous ce tag (meme mur, a moins d'une demi-toile),
     * sa colonne (32 px, une dalle) est retiree du dessin.
     */
    private updateDoorCut(geometry: IRoomGeometry): void
    {
        this._doorChecked = true;

        const roomIdString = this.object.model.getValue<string>(RoomObjectVariable.OBJECT_ROOM_ID);
        const roomId = ((roomIdString && (parseInt(roomIdString.split('_')[0]) || 0)) || -1);

        if(roomId < 0) return;

        const engine = GetRoomEngine();
        const doors = (engine ? engine.getRoomDoors(roomId) : []);

        if(!doors || !doors.length) return;

        const tagScreen = geometry.getScreenPosition(this.object.getLocation());

        if(!tagScreen) return;

        const zoom = ((geometry.scale > 0) ? (geometry.scale / 64) : 1);

        let cut: { x: number; width: number } = null;

        for(const door of doors)
        {
            const doorScreen = geometry.getScreenPosition(new Vector3d((door.x + 0.5), (door.y + 0.5), door.z));

            if(!doorScreen) continue;

            const dx = ((doorScreen.x - tagScreen.x) / zoom);
            const dy = ((doorScreen.y - tagScreen.y) / zoom);

            // Le point de la porte est au sol, juste sous le tag (pas sur le mur d'en face, bien plus bas ou plus haut).
            if((Math.abs(dx) > ((this._canvasWidth / 2) + 24)) || (dy < -24) || (dy > 240)) continue;

            const margin = 3;

            cut = { x: Math.round((this._canvasWidth / 2) + dx - 16 - margin), width: (32 + (margin * 2)) };

            break;
        }

        if((cut === null) === (this._doorCut === null) && (!cut || ((cut.x === this._doorCut.x) && (cut.width === this._doorCut.width)))) return;

        this._doorCut = cut;

        this.buildTextures();
        this._needsSpriteUpdate = true;
    }

    private buildTextures(): void
    {
        if(!this._image || (typeof document === 'undefined')) return;

        this.destroyTextures();

        this._canvasWidth = this._width;
        this._canvasHeight = Math.ceil(this._height + (this._width * WallTagVisualization.SKEW));

        const finalCanvas = document.createElement('canvas');

        finalCanvas.width = this._canvasWidth;
        finalCanvas.height = this._canvasHeight;

        const finalCtx = finalCanvas.getContext('2d');

        if(!finalCtx) return;

        this.drawSkewedImage(finalCtx);

        this._finalTexture = Texture.from(finalCanvas);
        this._finalTexture.source.scaleMode = 'nearest';

        this._workCanvas = document.createElement('canvas');
        this._workCanvas.width = this._canvasWidth;
        this._workCanvas.height = this._canvasHeight;
        this._workTexture = Texture.from(this._workCanvas);
        this._workTexture.source.scaleMode = 'nearest';
    }

    /** Redessine la texture finale en place (apercu en direct), sans reallouer. */
    private redrawFinal(): void
    {
        if(!this._finalTexture || !this._image) return;

        const canvas = (this._finalTexture.source.resource as HTMLCanvasElement);
        const ctx = (canvas && canvas.getContext) ? canvas.getContext('2d') : null;

        if(!ctx) { this.buildTextures(); return; }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawSkewedImage(ctx);
        this._finalTexture.source.update();
    }

    private startReveal(time: number): void
    {
        if(!this._workCanvas) return;

        this._revealStart = time;

        // Taches de peinture : positions relatives au centre, tailles variees (deterministe par tag).
        this._blobs = [];

        let seed = 0;

        for(let i = 0; i < this._dataKey.length; i += 97) seed = ((seed * 31) + this._dataKey.charCodeAt(i)) & 0xFFFF;

        const random = () =>
        {
            seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;

            return (seed / 0x7FFFFFFF);
        };

        for(let i = 0; i < 9; i++)
        {
            this._blobs.push({
                dx: ((random() - 0.5) * 1.1),
                dy: ((random() - 0.5) * 1.1),
                scale: (0.35 + (random() * 0.5))
            });
        }

        this._drops = [];

        for(let i = 0; i < WallTagVisualization.DROP_COUNT; i++)
        {
            const angle = ((Math.PI * 2) * (i / WallTagVisualization.DROP_COUNT)) + ((Math.random() - 0.5) * 0.7);
            const speed = (50 + (Math.random() * 90));

            this._drops.push({
                x: ((Math.random() - 0.5) * this._width * 0.5),
                y: ((Math.random() - 0.5) * this._height * 0.5),
                vx: (Math.cos(angle) * speed),
                vy: ((Math.sin(angle) * speed * 0.6) - 25),
                size: (0.35 + (Math.random() * 0.8)),
                delay: (Math.random() * 350),
                tint: ((Math.random() < 0.7) ? this._tint : 0xFFFFFF)
            });
        }

        this.renderReveal(time);
    }

    private renderReveal(time: number): void
    {
        if(!this._workCanvas || !this._image) return;

        const t = Math.min(1, ((time - this._revealStart) / WallTagVisualization.REVEAL_MS));
        const ctx = this._workCanvas.getContext('2d');

        if(!ctx) return;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

        this.drawSkewedImage(ctx);

        // Masque : la peinture apparait par taches depuis le centre, bords doux, plus un leger voile
        // global qui s'opacifie (la couche de fond de la bombe).
        const eased = (1 - Math.pow(1 - t, 2.2));
        const cx = (this._canvasWidth / 2);
        const cy = (this._canvasHeight / 2);
        const maxRadius = (Math.sqrt((this._canvasWidth * this._canvasWidth) + (this._canvasHeight * this._canvasHeight)) / 2) * 1.15;

        ctx.globalCompositeOperation = 'destination-in';

        const mask = document.createElement('canvas');

        mask.width = this._canvasWidth;
        mask.height = this._canvasHeight;

        const maskCtx = mask.getContext('2d');

        if(maskCtx)
        {
            maskCtx.fillStyle = `rgba(0,0,0,${ (eased * 0.35).toFixed(3) })`;
            maskCtx.fillRect(0, 0, mask.width, mask.height);

            const blobs = [ { dx: 0, dy: 0, scale: 1 }, ...this._blobs ];

            for(const blob of blobs)
            {
                const radius = Math.max(1, (maxRadius * eased * blob.scale));
                const bx = (cx + (blob.dx * this._canvasWidth));
                const by = (cy + (blob.dy * this._canvasHeight));
                const gradient = maskCtx.createRadialGradient(bx, by, 0, bx, by, radius);

                gradient.addColorStop(0, 'rgba(0,0,0,1)');
                gradient.addColorStop(0.7, 'rgba(0,0,0,1)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                maskCtx.fillStyle = gradient;
                maskCtx.beginPath();
                maskCtx.arc(bx, by, radius, 0, Math.PI * 2);
                maskCtx.fill();
            }

            ctx.drawImage(mask, 0, 0);
        }

        ctx.globalCompositeOperation = 'source-over';

        if(this._workTexture) this._workTexture.source.update();

        if(t >= 1) this._revealStart = -1;
    }

    private updateSprites(scale: number, time: number): void
    {
        const zoom = ((scale > 0) ? (scale / 64) : 1);
        const sprite = this.getSprite(0);

        if(sprite)
        {
            const revealing = (this._revealStart >= 0);
            const texture = (revealing ? this._workTexture : this._finalTexture);

            if(texture && this._imageReady && !this._hidden)
            {
                sprite.visible = true;
                sprite.texture = texture;
                sprite.type = 'wall_tag';
                sprite.tag = 'wall_tag';
                sprite.name = 'wall_tag';
                sprite.scale = zoom;
                sprite.offsetX = (-(this._canvasWidth * zoom) / 2);
                sprite.offsetY = (-(this._canvasHeight * zoom) / 2);
                sprite.alpha = 255;
                // Un tag a la bombe est fait de gouttelettes peu opaques : on accepte le clic des 8 % d'opacite.
                // L'apercu en direct, lui, laisse passer la souris jusqu'au mur (c'est lui qu'on peint).
                sprite.alphaTolerance = ((this._dataKey === 'preview') ? AlphaTolerance.MATCH_NOTHING : 20);
                sprite.relativeDepth = 0;
                sprite.clickHandling = false;
            }
            else
            {
                sprite.texture = null;
                sprite.visible = false;
            }
        }

        const dropTexture = WallTagVisualization.getDropTexture();
        const revealing = (this._revealStart >= 0);

        for(let i = 0; i < WallTagVisualization.DROP_COUNT; i++)
        {
            const dropSprite = this.getSprite(1 + i);

            if(!dropSprite) continue;

            const drop = this._drops[i];

            if(!revealing || !drop || !dropTexture)
            {
                dropSprite.texture = null;
                dropSprite.visible = false;
                dropSprite.alphaTolerance = AlphaTolerance.MATCH_NOTHING;

                continue;
            }

            const elapsed = Math.max(0, (time - this._revealStart - drop.delay));
            const life = Math.min(1, (elapsed / (WallTagVisualization.REVEAL_MS - 250)));
            const seconds = (elapsed / 1000);
            const px = (drop.x + (drop.vx * seconds));
            const py = (drop.y + (drop.vy * seconds) + (90 * seconds * seconds));
            const magnitude = (drop.size * zoom * (1 - (life * 0.5)));
            const alpha = (life < 0.1) ? (life / 0.1) : (1 - ((life - 0.1) / 0.9));

            dropSprite.visible = true;
            dropSprite.texture = dropTexture;
            dropSprite.type = 'wall_tag';
            dropSprite.tag = 'wall_tag_drop';
            dropSprite.name = 'wall_tag_drop';
            dropSprite.scale = magnitude;
            dropSprite.offsetX = ((px * zoom) - ((dropTexture.width * magnitude) / 2));
            dropSprite.offsetY = ((py * zoom) - ((dropTexture.height * magnitude) / 2));
            dropSprite.alpha = Math.round(Math.max(0, Math.min(1, alpha)) * 255);
            dropSprite.color = drop.tint;
            dropSprite.alphaTolerance = AlphaTolerance.MATCH_NOTHING;
            dropSprite.relativeDepth = -0.01;
            dropSprite.clickHandling = false;
        }
    }

    private static getDropTexture(): Texture
    {
        if(WallTagVisualization._dropTexture) return WallTagVisualization._dropTexture;

        if((typeof document === 'undefined') || !document.createElement) return null;

        const size = 12;
        const canvas = document.createElement('canvas');

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');

        if(!ctx) return null;

        const gradient = ctx.createRadialGradient((size / 2), (size / 2), 0, (size / 2), (size / 2), (size / 2));

        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.55, 'rgba(255,255,255,0.9)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        WallTagVisualization._dropTexture = Texture.from(canvas);

        return WallTagVisualization._dropTexture;
    }

    private static averageColor(image: HTMLImageElement): number
    {
        try
        {
            const canvas = document.createElement('canvas');

            canvas.width = 8;
            canvas.height = 8;

            const ctx = canvas.getContext('2d');

            if(!ctx) return 0xFFFFFF;

            ctx.drawImage(image, 0, 0, 8, 8);

            const pixels = ctx.getImageData(0, 0, 8, 8).data;

            let r = 0; let g = 0; let b = 0; let weight = 0;

            for(let i = 0; i < pixels.length; i += 4)
            {
                const a = (pixels[i + 3] / 255);

                if(a <= 0.05) continue;

                r += (pixels[i] * a);
                g += (pixels[i + 1] * a);
                b += (pixels[i + 2] * a);
                weight += a;
            }

            if(!weight) return 0xFFFFFF;

            return ((Math.round(r / weight) << 16) | (Math.round(g / weight) << 8) | Math.round(b / weight));
        }
        catch
        {
            return 0xFFFFFF;
        }
    }
}
