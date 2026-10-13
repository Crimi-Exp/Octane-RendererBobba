import { describe, expect, it } from 'vitest';
import { BrandedImageScaleMode, BrandedImageStableScale } from './FurnitureBrandedImageVisualization';

// Arrondi du shader (roundPixels) : floor(x + 0.5) en pixels d'ecran.
const shaderRound = (value: number) => Math.floor(value + 0.5);

describe('BrandedImageStableScale', () =>
{
    it('leaves a full-size image untouched', () =>
    {
        expect(BrandedImageStableScale(1, 501, 300)).toBe(1);
    });

    it('moves a half-pixel edge just past the tie, so it always rounds the same way wherever the room is dragged', () =>
    {
        const width = 501;
        const scale = BrandedImageStableScale(0.5, width, 300);
        const drawn = width * scale;

        expect(drawn).toBeGreaterThan(250.5);
        expect(drawn - 250.5).toBeLessThan(0.02);

        // le bord droit rejoint toujours le fond suivant pose a Math.round(250.5) = 251, quel que soit le decalage
        for(const offset of [ 0, 1, 37, 512, 1023, 4095 ])
        {
            const jitter = (offset * 1e-7);

            expect(shaderRound(offset + drawn + jitter) - offset).toBe(251);
            expect(shaderRound(offset + drawn - jitter) - offset).toBe(251);
        }
    });

    it('never grows the image by more than a hundredth of a pixel', () =>
    {
        for(const [ scale, w, h ] of [ [ 0.5, 999, 3 ], [ 1.5, 41, 2000 ], [ 0.37, 1, 1 ] ])
        {
            const stable = BrandedImageStableScale(scale, w, h);

            expect((stable - scale) * Math.max(w, h)).toBeCloseTo(0.01, 6);
        }
    });
});

describe('BrandedImageScaleMode', () =>
{
    it('keeps pixels sharp at whole sizes, smooths only reductions and odd sizes', () =>
    {
        expect(BrandedImageScaleMode(1)).toBe('nearest');
        expect(BrandedImageScaleMode(2)).toBe('nearest');
        expect(BrandedImageScaleMode(0.5)).toBe('linear');
        expect(BrandedImageScaleMode(1.5)).toBe('linear');
    });
});
