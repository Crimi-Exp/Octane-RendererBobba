import { RoomObjectVariable } from '@octane/api';
import { GetAssetManager } from '@octane/assets';
import { Texture } from 'pixi.js';
import { FurnitureVisualization } from './FurnitureVisualization';

/**
 * BobbaTok : echelle d'affichage de l'image sans « trait » selon la position de l'appart.
 * Quand la taille affichee tombe pile sur un demi-pixel (image impaire au dezoom, taille 150 %...), l'arrondi au
 * pixel du bord droit/bas hesite selon l'endroit ou on a fait glisser l'appart : un trait d'un pixel apparait ou
 * disparait entre deux fonds colles. Un ecart minuscule (1/100 de pixel) fait toujours arrondir du meme cote.
 */
export const BrandedImageStableScale = (scale: number, width: number, height: number): number =>
{
    if(!(scale > 0) || (scale === 1)) return scale;

    const size = Math.max(1, width || 0, height || 0);

    return (scale + (0.01 / size));
};

/**
 * Lissage de l'image : net (pixels comme le reste de l'appart) quand elle est affichee a taille entiere
 * (100 %, 200 %...), lisse seulement quand elle est reduite ou agrandie d'une valeur non entiere.
 */
export const BrandedImageScaleMode = (scale: number): 'nearest' | 'linear' =>
{
    if((scale >= 1) && (Math.abs(scale - Math.round(scale)) < 0.0001)) return 'nearest';

    return 'linear';
};

export class FurnitureBrandedImageVisualization extends FurnitureVisualization
{
    protected static BRANDED_IMAGE: string = 'branded_image';
    protected static STATE_0: number = 0;
    protected static STATE_1: number = 1;
    protected static STATE_2: number = 2;
    protected static STATE_3: number = 3;

    protected _imageUrl: string;
    protected _shortUrl: string;
    protected _imageReady: boolean;

    protected _offsetX: number;
    protected _offsetY: number;
    protected _offsetZ: number;
    protected _imageScale: number;
    protected _imageAlpha: number;
    protected _currentFrame: number;
    protected _totalFrames: number;

    constructor()
    {
        super();

        this._imageUrl = null;
        this._shortUrl = null;
        this._imageReady = false;

        this._offsetX = 0;
        this._offsetY = 0;
        this._offsetZ = 0;
        this._imageScale = 100;
        this._imageAlpha = 100;
        this._currentFrame = -1;
        this._totalFrames = -1;
    }

    public dispose(): void
    {
        super.dispose();

        if(this._imageUrl)
        {
            (this.asset && this.asset.disposeAsset(this._imageUrl));
            // dispose all
        }
    }

    protected updateObject(scale: number, direction: number): boolean
    {
        if(!super.updateObject(scale, direction)) return false;

        if(this._imageReady) this.checkAndCreateImageForCurrentState();

        return true;
    }

    protected updateModel(scale: number): boolean
    {
        const flag = super.updateModel(scale);

        if(flag)
        {
            this._offsetX = (this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BRANDING_OFFSET_X) || 0);
            this._offsetY = (this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BRANDING_OFFSET_Y) || 0);
            this._offsetZ = (this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BRANDING_OFFSET_Z) || 0);
            this._imageScale = (this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BRANDING_SCALE) || 100);

            const alpha = this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BRANDING_ALPHA);
            this._imageAlpha = ((alpha === undefined) || (alpha === null)) ? 100 : alpha;
        }

        if(!this._imageReady)
        {
            this._imageReady = this.checkIfImageReady();

            if(this._imageReady)
            {
                this.checkAndCreateImageForCurrentState();

                return true;
            }
        }
        else
        {
            if(this.checkIfImageChanged())
            {
                this._imageReady = false;
                this._imageUrl = null;

                return true;
            }
        }

        return flag;
    }

    private checkIfImageChanged(): boolean
    {
        const imageUrl = this.object.model.getValue<string>(RoomObjectVariable.FURNITURE_BRANDING_IMAGE_URL);

        if(imageUrl && (imageUrl === this._imageUrl)) return false;

        (this.asset && this.asset.disposeAsset(this._imageUrl));

        return true;
    }

    protected checkIfImageReady(): boolean
    {
        const model = this.object && this.object.model;

        if(!model) return false;

        const imageUrl = this.object.model.getValue<string>(RoomObjectVariable.FURNITURE_BRANDING_IMAGE_URL);

        if(!imageUrl) return false;

        if(this._imageUrl && (this._imageUrl === imageUrl)) return false;

        const imageStatus = this.object.model.getValue<number>(RoomObjectVariable.FURNITURE_BRANDING_IMAGE_STATUS);

        if(imageStatus === 1)
        {
            let texture: Texture = null;

            texture = GetAssetManager().getTexture(imageUrl);

            if(!texture) return false;

            this.imageReady(texture, imageUrl);

            return true;
        }

        return false;
    }

    protected imageReady(texture: Texture, imageUrl: string): void
    {
        if(!texture)
        {
            this._imageUrl = null;

            return;
        }

        this._imageUrl = imageUrl;
    }

    protected checkAndCreateImageForCurrentState(): void
    {
        if(!this._imageUrl) return;

        const texture = GetAssetManager().getTexture(this._imageUrl);

        if(!texture) return;

        const state = this.object.getState(0);

        this.addBackgroundAsset(texture, state, 0);
    }

    protected addBackgroundAsset(texture: Texture, state: number, frame: number): void
    {
        let x = 0;
        let y = 0;
        let flipH = false;
        let flipV = false;

        switch(state)
        {
            case FurnitureBrandedImageVisualization.STATE_0:
                x = 0;
                y = 0;
                flipH = false;
                flipV = false;
                break;
            case FurnitureBrandedImageVisualization.STATE_1:
                x = -(texture.width);
                y = 0;
                flipH = true;
                flipV = false;
                break;
            case FurnitureBrandedImageVisualization.STATE_2:
                x = -(texture.width);
                y = -(texture.height);
                flipH = true;
                flipV = true;
                break;
            case FurnitureBrandedImageVisualization.STATE_3:
                x = 0;
                y = -(texture.height);
                flipH = false;
                flipV = true;
                break;
        }

        this.asset.addAsset(`${this._imageUrl}_${frame}`, texture, true, x, y, flipH, flipV);
    }

    protected getSpriteAssetName(scale: number, layerId: number): string
    {
        const tag = this.getLayerTag(scale, this._direction, layerId);

        if((tag === FurnitureBrandedImageVisualization.BRANDED_IMAGE) && this._imageUrl)
        {
            return `${this._imageUrl}_${this.getFrameNumber(scale, layerId)}`;
        }

        return super.getSpriteAssetName(scale, layerId);
    }

    /** Decalage du calque venant des donnees du mobi (sans le decalage de l'image). */
    protected getFrameLayerXOffset(scale: number, direction: number, layerId: number): number
    {
        return super.getLayerXOffset(scale, direction, layerId);
    }

    protected getFrameLayerYOffset(scale: number, direction: number, layerId: number): number
    {
        return super.getLayerYOffset(scale, direction, layerId);
    }

    /** Decalage de l'image elle-meme, en pixels du zoom normal (64). */
    protected getBrandedOffsetX(direction: number): number
    {
        return (this._offsetX || 0);
    }

    protected getBrandedOffsetY(direction: number): number
    {
        return (this._offsetY || 0);
    }

    /** Rapport entre la taille de l'appart et le zoom normal (64) : 1 au zoom normal, 0,5 au dezoom (32). */
    protected static zoomFactor(scale: number): number
    {
        return ((scale > 0) ? (scale / 64) : 1);
    }

    protected isBrandedImageLayer(scale: number, layerId: number): boolean
    {
        return this.getLayerTag(scale, this._direction, layerId) === FurnitureBrandedImageVisualization.BRANDED_IMAGE;
    }

    // offsetX/Y move ONLY the branded image layer (the furni frame stays put).
    // Authored at full scale (64) and scaled with the room zoom.
    protected getLayerXOffset(scale: number, direction: number, layerId: number): number
    {
        const offset = super.getLayerXOffset(scale, direction, layerId);

        return this.isBrandedImageLayer(scale, layerId) ? offset + ((this._offsetX || 0) * (scale / 64)) : offset;
    }

    protected getLayerYOffset(scale: number, direction: number, layerId: number): number
    {
        const offset = super.getLayerYOffset(scale, direction, layerId);

        return this.isBrandedImageLayer(scale, layerId) ? offset + ((this._offsetY || 0) * (scale / 64)) : offset;
    }

    // offsetZ is the z-index / depth (overlap order, like CSS z-index).
    protected getLayerZOffset(scale: number, direction: number, layerId: number): number
    {
        const offset = super.getLayerZOffset(scale, direction, layerId);

        return this.isBrandedImageLayer(scale, layerId) ? offset + (this._offsetZ || 0) : offset;
    }

    // `scale` zooms the branded image (percent, 100 = 1x). Applied via the
    // sprite's scale (a real Pixi sprite scale) — NOT by writing width/height,
    // which are read-only on RoomObjectSprite and would throw every frame.
    protected updateSprite(scale: number, layerId: number): void
    {
        super.updateSprite(scale, layerId);

        const sprite = this.getSprite(layerId);

        if(!sprite) return;

        if(this.isBrandedImageLayer(scale, layerId))
        {
            // BobbaTok : l'image (et ses decalages) est faite pour le zoom normal (64) ; au dezoom (32) elle suit
            // l'appart et passe a moitie, comme le reste des mobis. Au zoom normal rien ne change.
            const factor = FurnitureBrandedImageVisualization.zoomFactor(scale) * this._displayScale;
            const sizeScale = (((this._cacheSize >= 32) && (scale > 0)) ? (scale / this._cacheSize) : 1) * this._displayScale;
            const assetData = this.getAsset(this.getSpriteAssetName(scale, layerId), layerId);

            const imageScale = Math.max(0.05, ((this._imageScale || 100) / 100) * factor);

            sprite.scale = BrandedImageStableScale(imageScale, assetData?.width, assetData?.height);

            const source = assetData?.texture?.source;
            const scaleMode = BrandedImageScaleMode(imageScale);

            if(source && (source.scaleMode !== scaleMode)) source.scaleMode = scaleMode;

            if(assetData)
            {
                // arrondi au pixel : au dezoom un decalage impair tomberait entre deux pixels (image floue, liseres
                // entre deux fonds colles l'un a l'autre)
                sprite.offsetX = Math.round((this.getFrameLayerXOffset(scale, this._direction, layerId) * sizeScale) + ((assetData.offsetX + this.getBrandedOffsetX(this._direction)) * factor) + this._scaleShiftX);
                sprite.offsetY = Math.round((this.getFrameLayerYOffset(scale, this._direction, layerId) * sizeScale) + ((assetData.offsetY + this.getBrandedOffsetY(this._direction)) * factor) + this._scaleShiftY);
            }

            // `alpha` is authored 0-100 (percent); RoomObjectSprite.alpha is 0-255.
            // 100 (or unset) = fully opaque.
            const alphaPercent = Math.max(0, Math.min(100, this._imageAlpha ?? 100));
            sprite.alpha = Math.round((alphaPercent / 100) * 255);
        }
        else
        {
            sprite.scale = 1;
        }
    }
}
