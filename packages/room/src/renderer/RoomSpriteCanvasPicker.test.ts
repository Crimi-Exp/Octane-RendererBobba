import { AlphaTolerance } from '@octane/api';
import { Point } from 'pixi.js';
import { describe, expect, it, vi } from 'vitest';
import { RoomSpriteCanvas } from './RoomSpriteCanvas';

vi.mock('@octane/utils', () => ({ GetTicker: () => ({ deltaTime: 1 }), TextureUtils: {}, Vector3d: class {} }));
vi.mock('@octane/configuration', () => ({ GetConfiguration: () => ({ getValue: (_key: string, fallback: unknown) => fallback }) }));
vi.mock('../utils', () => ({ RoomEnterEffect: { isVisualizationOn: () => false }, RoomGeometry: class {}, RoomRotatingEffect: {}, RoomShakingEffect: {} }));

type FakeSprite = { tag: string; alpha: number; alphaTolerance: number; containsPoint: (point: Point) => boolean };

const fake = (tag: string, alphaTolerance: number, alpha = 1): FakeSprite =>
{
    const sprite: FakeSprite = {
        tag,
        alpha,
        alphaTolerance,
        // comme ExtendedSprite : rien ne touche au-dela de 255
        containsPoint: () => (sprite.alphaTolerance <= 255)
    };

    return sprite;
};

describe('clic droit : images de fond', () =>
{
    it("teste l'image d'un fond meme quand elle laisse passer les clics", () =>
    {
        const background = fake('branded_image', AlphaTolerance.MATCH_NOTHING);
        const pickThrough = RoomSpriteCanvas.isPickThroughSprite(background as never);

        expect(pickThrough).toBe(true);
        expect(RoomSpriteCanvas.pickContainsPoint(background as never, new Point(1, 1), pickThrough)).toBe(true);
        // la tolerance d'origine est rendue (les clics normaux continuent de traverser le fond)
        expect(background.alphaTolerance).toBe(AlphaTolerance.MATCH_NOTHING);
    });

    it('ne rend pas cliquables les autres calques traversables (ombres, calques caches)', () =>
    {
        expect(RoomSpriteCanvas.isPickThroughSprite(fake('', AlphaTolerance.MATCH_NOTHING) as never)).toBe(false);
        expect(RoomSpriteCanvas.isPickThroughSprite(fake('branded_image', AlphaTolerance.MATCH_NOTHING, 0) as never)).toBe(false);
        expect(RoomSpriteCanvas.isPickThroughSprite(fake('branded_image', AlphaTolerance.MATCH_OPAQUE_PIXELS) as never)).toBe(false);
    });
});
