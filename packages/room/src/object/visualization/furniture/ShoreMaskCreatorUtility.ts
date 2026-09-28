import { IGraphicAsset, IGraphicAssetCollection } from '@octane/api';
import { TextureUtils } from '@octane/utils';
import { CanvasSource, DOMAdapter, ICanvas, Rectangle, Sprite, Texture } from 'pixi.js';

export type ShoreAlphaMask = { width: number, height: number, alpha: Uint8Array };

export class ShoreMaskCreatorUtility
{
    public static readonly NO_CUT: number = 0;
    public static readonly STRAIGHT_CUT: number = 1;
    public static readonly INNER_CUT: number = 2;

    private static readonly CUT_TYPE_COUNT: number = 3;
    private static readonly MASK_COLOR_TRANSPARENT: number = 0;
    private static readonly MASK_COLOR_SOLID: number = 0xFFFFFFFF;

    private static _masks: WeakMap<IGraphicAssetCollection, Map<string, ShoreAlphaMask>> = new WeakMap();
    private static _masksDone: WeakMap<IGraphicAssetCollection, Set<number>> = new WeakMap();
    private static _shorePixels: WeakMap<Texture, Uint8ClampedArray> = new WeakMap();
    private static _instanceCanvases: WeakMap<Texture, ICanvas> = new WeakMap();

    public static createEmptyMask(width: number, height: number): ShoreAlphaMask
    {
        return { width, height, alpha: new Uint8Array(Math.max(0, width * height)) };
    }

    public static getInstanceMaskName(instanceId: number, size: number): string
    {
        return `instance_mask_${ instanceId }_${ size }`;
    }

    public static getBorderType(start: number, end: number): number
    {
        return start + (end * ShoreMaskCreatorUtility.CUT_TYPE_COUNT);
    }

    /** The instance's own shore asset, made empty at the shore's size and offset the first time. */
    public static getInstanceMask(instanceId: number, size: number, collection: IGraphicAssetCollection, shore: IGraphicAsset): IGraphicAsset
    {
        const name = ShoreMaskCreatorUtility.getInstanceMaskName(instanceId, size);
        let asset = collection.getAsset(name);

        if(!asset && shore?.texture)
        {
            const canvas = DOMAdapter.get().createCanvas(Math.max(1, shore.texture.width), Math.max(1, shore.texture.height));
            const texture = new Texture({ source: new CanvasSource({ resource: canvas, scaleMode: 'nearest' }) });

            ShoreMaskCreatorUtility._instanceCanvases.set(texture, canvas);

            collection.addAsset(name, texture, false, shore.x, shore.y, shore.flipH, shore.flipV);

            asset = collection.getAsset(name);
        }

        return asset;
    }

    public static disposeInstanceMask(instanceId: number, size: number, collection: IGraphicAssetCollection): void
    {
        const name = ShoreMaskCreatorUtility.getInstanceMaskName(instanceId, size);
        const texture = collection.getAsset(name)?.texture;

        collection.disposeAsset(name);

        // disposeAsset does not find textures added at runtime, so this one is freed here.
        if(texture && !texture.destroyed)
        {
            ShoreMaskCreatorUtility._instanceCanvases.delete(texture);
            texture.destroy(true);
        }
    }

    /** The masks of every segment shown, ORed into `target`. */
    public static createShoreMask2x2(target: ShoreAlphaMask, size: number, borders: boolean[], borderTypes: number[], collection: IGraphicAssetCollection): ShoreAlphaMask
    {
        target.alpha.fill(0);

        const masks = ShoreMaskCreatorUtility._masks.get(collection);

        borders.forEach((shown, segment) =>
        {
            if(!shown) return;

            const mask = masks?.get(`mask_${ size }_${ segment }_${ borderTypes[segment] }`);

            if(!mask) return;

            const width = Math.min(mask.width, target.width);
            const height = Math.min(mask.height, target.height);

            for(let y = 0; y < height; y++)
            {
                for(let x = 0; x < width; x++)
                {
                    if(mask.alpha[(y * mask.width) + x]) target.alpha[(y * target.width) + x] = 255;
                }
            }
        });

        return target;
    }

    /** Every segment's mask for every cut, once per size and collection. */
    public static initializeShoreMasks(size: number, collection: IGraphicAssetCollection, shore: IGraphicAsset): boolean
    {
        if(!collection) return false;

        let done = ShoreMaskCreatorUtility._masksDone.get(collection);

        if(done?.has(size)) return true;

        const texture = shore?.texture;

        if(!texture) return false;

        const outerCuts = [ 0, 1, 2, 0, 1, 2 ];
        const innerCuts = [ 1, 1, 1, 2, 2, 2 ];

        for(let i = 0; i < outerCuts.length; i++)
        {
            let mask = ShoreMaskCreatorUtility.createMaskLeft(texture.width, texture.height);

            ShoreMaskCreatorUtility.cutLeftMask(mask, size, outerCuts[i], innerCuts[i]);
            ShoreMaskCreatorUtility.storeLeftMask(collection, mask, size, outerCuts[i], innerCuts[i]);

            mask = ShoreMaskCreatorUtility.createMaskRight(texture.width, texture.height);

            ShoreMaskCreatorUtility.cutRightMask(mask, size, innerCuts[i], outerCuts[i]);
            ShoreMaskCreatorUtility.storeRightMask(collection, mask, size, innerCuts[i], outerCuts[i]);
        }

        if(!done) ShoreMaskCreatorUtility._masksDone.set(collection, done = new Set());

        done.add(size);

        return true;
    }

    /** Copies the shore through the mask into the instance asset's canvas, keeping its texture. */
    public static drawInstanceMask(instance: IGraphicAsset, shore: IGraphicAsset, mask: ShoreAlphaMask): boolean
    {
        const target = instance.texture;
        const canvas = target ? ShoreMaskCreatorUtility._instanceCanvases.get(target) : undefined;
        const source = shore.texture;

        if(!target || !canvas || !source) return false;

        const pixels = ShoreMaskCreatorUtility.getShorePixels(source);
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        if(!pixels || !context) return false;

        const width = canvas.width;
        const height = canvas.height;
        const image = context.createImageData(width, height);
        const sourceWidth = Math.trunc(source.width);
        const copyWidth = Math.min(width, sourceWidth);
        const copyHeight = Math.min(height, Math.trunc(source.height));

        for(let y = 0; y < copyHeight; y++)
        {
            for(let x = 0; x < copyWidth; x++)
            {
                const maskAlpha = ((x < mask.width) && (y < mask.height)) ? mask.alpha[(y * mask.width) + x] : 0;

                if(!maskAlpha) continue;

                const from = ((y * sourceWidth) + x) * 4;
                const to = ((y * width) + x) * 4;

                image.data[to] = pixels[from];
                image.data[to + 1] = pixels[from + 1];
                image.data[to + 2] = pixels[from + 2];
                image.data[to + 3] = pixels[from + 3];
            }
        }

        context.putImageData(image, 0, 0);
        target.source.update();

        return true;
    }

    /** The shore's full bitmap (trim included), read back from the GPU once per texture. */
    private static getShorePixels(source: Texture): Uint8ClampedArray
    {
        let pixels = ShoreMaskCreatorUtility._shorePixels.get(source);

        if(pixels) return pixels;

        const sprite = new Sprite(source);

        try
        {
            pixels = new Uint8ClampedArray(TextureUtils.getPixels({
                target: sprite,
                frame: new Rectangle(0, 0, source.width, source.height),
                resolution: 1
            }).pixels);
        }
        catch
        {
            return null;
        }
        finally
        {
            sprite.destroy();
        }

        ShoreMaskCreatorUtility._shorePixels.set(source, pixels);

        return pixels;
    }

    private static createMaskLeft(width: number, height: number): ShoreAlphaMask
    {
        const mask = ShoreMaskCreatorUtility.createEmptyMask(width, height);

        ShoreMaskCreatorUtility.fillTopLeftCorner(mask, Math.trunc(width / 2), Math.trunc((height / 2) - 1), 1, ShoreMaskCreatorUtility.MASK_COLOR_SOLID);

        return mask;
    }

    private static cutLeftMask(mask: ShoreAlphaMask, size: number, outerCut: number, innerCut: number): void
    {
        if(outerCut === ShoreMaskCreatorUtility.STRAIGHT_CUT) ShoreMaskCreatorUtility.cutLeftMaskOuterCorner(mask, size, false);
        else if(outerCut === ShoreMaskCreatorUtility.INNER_CUT) ShoreMaskCreatorUtility.cutLeftMaskOuterCorner(mask, size, true);

        if(innerCut === ShoreMaskCreatorUtility.INNER_CUT) ShoreMaskCreatorUtility.cutLeftMaskInnerCorner(mask, size);
    }

    private static cutLeftMaskOuterCorner(mask: ShoreAlphaMask, size: number, straight: boolean): void
    {
        const y = Math.trunc((mask.height / 2) - (size / 2));
        const x = Math.trunc(mask.width / 2);

        if(straight) ShoreMaskCreatorUtility.fillRect(mask, x, 0, mask.width, y, ShoreMaskCreatorUtility.MASK_COLOR_TRANSPARENT);
        else ShoreMaskCreatorUtility.fillTopLeftCorner(mask, x, y - 1, 1, ShoreMaskCreatorUtility.MASK_COLOR_TRANSPARENT);
    }

    private static cutLeftMaskInnerCorner(mask: ShoreAlphaMask, size: number): void
    {
        const x = Math.trunc((mask.width / 2) + (size / 2));

        ShoreMaskCreatorUtility.fillRect(mask, x, 0, mask.width, mask.height / 2, ShoreMaskCreatorUtility.MASK_COLOR_TRANSPARENT);
    }

    private static createMaskRight(width: number, height: number): ShoreAlphaMask
    {
        const mask = ShoreMaskCreatorUtility.createEmptyMask(width, height);

        ShoreMaskCreatorUtility.fillBottomRightCorner(mask, Math.trunc((width / 2) + 1), Math.trunc((height / 2) - 1), ShoreMaskCreatorUtility.MASK_COLOR_SOLID);

        return mask;
    }

    private static cutRightMask(mask: ShoreAlphaMask, size: number, innerCut: number, outerCut: number): void
    {
        if(outerCut === ShoreMaskCreatorUtility.STRAIGHT_CUT) ShoreMaskCreatorUtility.cutRightMaskOuterCorner(mask, size, false);
        else if(outerCut === ShoreMaskCreatorUtility.INNER_CUT) ShoreMaskCreatorUtility.cutRightMaskOuterCorner(mask, size, true);

        if(innerCut === ShoreMaskCreatorUtility.INNER_CUT) ShoreMaskCreatorUtility.cutRightMaskInnerCorner(mask, size);
    }

    private static cutRightMaskInnerCorner(mask: ShoreAlphaMask, size: number): void
    {
        const x = Math.trunc((mask.width / 2) + (size / 2));

        ShoreMaskCreatorUtility.fillRect(mask, x, 0, mask.width, (mask.height / 2) - (size / 4), ShoreMaskCreatorUtility.MASK_COLOR_TRANSPARENT);
    }

    private static cutRightMaskOuterCorner(mask: ShoreAlphaMask, size: number, straight: boolean): void
    {
        const y = Math.trunc(mask.height / 2);
        const x = Math.trunc((mask.width / 2) + size);

        if(straight) ShoreMaskCreatorUtility.fillRect(mask, x, 0, mask.width, y, ShoreMaskCreatorUtility.MASK_COLOR_TRANSPARENT);
        else ShoreMaskCreatorUtility.fillBottomRightCorner(mask, x + 1, y - 1, ShoreMaskCreatorUtility.MASK_COLOR_TRANSPARENT);
    }

    /** The left mask in segments 0, 3, 4 and 7: as is, flipped vertically, both ways, horizontally. */
    private static storeLeftMask(collection: IGraphicAssetCollection, mask: ShoreAlphaMask, size: number, outerCut: number, innerCut: number): void
    {
        const masks = ShoreMaskCreatorUtility.getMasks(collection);

        masks.set(`mask_${ size }_0_${ ShoreMaskCreatorUtility.getBorderType(outerCut, innerCut) }`, mask);
        masks.set(`mask_${ size }_3_${ ShoreMaskCreatorUtility.getBorderType(innerCut, outerCut) }`, ShoreMaskCreatorUtility.flip(mask, false, true));
        masks.set(`mask_${ size }_4_${ ShoreMaskCreatorUtility.getBorderType(outerCut, innerCut) }`, ShoreMaskCreatorUtility.flip(mask, true, true));
        masks.set(`mask_${ size }_7_${ ShoreMaskCreatorUtility.getBorderType(innerCut, outerCut) }`, ShoreMaskCreatorUtility.flip(mask, true, false));
    }

    /** The right mask in segments 1, 2, 5 and 6. */
    private static storeRightMask(collection: IGraphicAssetCollection, mask: ShoreAlphaMask, size: number, innerCut: number, outerCut: number): void
    {
        const masks = ShoreMaskCreatorUtility.getMasks(collection);

        masks.set(`mask_${ size }_1_${ ShoreMaskCreatorUtility.getBorderType(innerCut, outerCut) }`, mask);
        masks.set(`mask_${ size }_2_${ ShoreMaskCreatorUtility.getBorderType(outerCut, innerCut) }`, ShoreMaskCreatorUtility.flip(mask, false, true));
        masks.set(`mask_${ size }_5_${ ShoreMaskCreatorUtility.getBorderType(innerCut, outerCut) }`, ShoreMaskCreatorUtility.flip(mask, true, true));
        masks.set(`mask_${ size }_6_${ ShoreMaskCreatorUtility.getBorderType(outerCut, innerCut) }`, ShoreMaskCreatorUtility.flip(mask, true, false));
    }

    private static getMasks(collection: IGraphicAssetCollection): Map<string, ShoreAlphaMask>
    {
        let masks = ShoreMaskCreatorUtility._masks.get(collection);

        if(!masks) ShoreMaskCreatorUtility._masks.set(collection, masks = new Map());

        return masks;
    }

    private static flip(mask: ShoreAlphaMask, flipH: boolean, flipV: boolean): ShoreAlphaMask
    {
        const flipped = ShoreMaskCreatorUtility.createEmptyMask(mask.width, mask.height);

        for(let y = 0; y < mask.height; y++)
        {
            const fromY = flipV ? (mask.height - 1 - y) : y;

            for(let x = 0; x < mask.width; x++)
            {
                const fromX = flipH ? (mask.width - 1 - x) : x;

                flipped.alpha[(y * mask.width) + x] = mask.alpha[(fromY * mask.width) + fromX];
            }
        }

        return flipped;
    }

    /** Flash `setPixel32`: truncated coordinates, ignored outside the bitmap. */
    private static setPixel(mask: ShoreAlphaMask, x: number, y: number, color: number): void
    {
        x = Math.trunc(x);
        y = Math.trunc(y);

        if((x < 0) || (y < 0) || (x >= mask.width) || (y >= mask.height)) return;

        mask.alpha[(y * mask.width) + x] = (color >>> 24) & 0xFF;
    }

    /** Flash `fillRect`: half-pixel far edges round to the nearest even integer. */
    private static fillRect(mask: ShoreAlphaMask, x: number, y: number, width: number, height: number, color: number): void
    {
        const left = Math.max(0, Math.floor(x));
        const top = Math.max(0, Math.floor(y));
        const right = Math.min(mask.width, ShoreMaskCreatorUtility.roundEdge(x + width));
        const bottom = Math.min(mask.height, ShoreMaskCreatorUtility.roundEdge(y + height));
        const value = (color >>> 24) & 0xFF;

        for(let row = top; row < bottom; row++) mask.alpha.fill(value, (row * mask.width) + left, (row * mask.width) + Math.max(left, right));
    }

    private static roundEdge(value: number): number
    {
        const lower = Math.floor(value);

        return ((value - lower) === 0.5) ? (lower + (lower & 1)) : Math.round(value);
    }

    /** Every column from `x` rightwards filled from its top down to a row rising one pixel per two columns. */
    private static fillTopLeftCorner(mask: ShoreAlphaMask, x: number, y: number, phase: number, color: number): void
    {
        while(y >= 0)
        {
            for(let row = y; row >= 0; row--) ShoreMaskCreatorUtility.setPixel(mask, x, row, color);

            if(++phase >= 2)
            {
                y--;
                phase = 0;
            }

            x++;
        }
    }

    /** Every row from `y` upwards filled from `x` to the right edge, `x` moving two pixels per row. */
    private static fillBottomRightCorner(mask: ShoreAlphaMask, x: number, y: number, color: number): void
    {
        while(x < mask.width)
        {
            for(let column = x; column < mask.width; column++) ShoreMaskCreatorUtility.setPixel(mask, column, y, color);

            y--;
            x += 2;
        }
    }
}
