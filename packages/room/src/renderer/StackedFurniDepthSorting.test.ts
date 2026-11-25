import { describe, expect, it } from 'vitest';
import { Vector3d } from '@octane/utils';
import { getObjectAltitudeDepth, OBJECT_ALTITUDE_DEPTH, restsOnRideFurniture } from './ObjectAltitudeDepth';

// BobbaTok : un mobi pose sur un autre mobi (:setz) se trie par les profondeurs de calques des deux mobis, comme
// sur Habbo ; seul un mobi pose sur un roller (calques repousses) garde le poids de son altitude.
const furni = (location: Vector3d, layerDepths: number[] = [ 0 ], type = 'furni', shadow = true) => ({
    type,
    getLocation: () => location,
    model: { getValue: () => undefined },
    visualization: { sprites: new Map([
        ...layerDepths.map((relativeDepth, i) => [ i, { visible: true, relativeDepth, name: `${ type }_64_${ String.fromCharCode(97 + i) }_2_0` } ]),
        // chaque mobi a une ombre repoussee d'une case entiere (comme le vrai trone : throne_64_sd_2_0 a 0.7071)
        ...(shadow ? [ [ 99, { visible: true, relativeDepth: 0.7071, name: `${ type }_64_sd_2_0` } ] ] : [])
    ]) }
}) as any;

describe('stacked furni depth', () =>
{
    it('a furni stacked on a throne does not jump in front of its armrests', () =>
    {
        const throne = furni(new Vector3d(3, 3, 0), [ 0, -0.0219 ], 'throne');
        const statue = furni(new Vector3d(3, 3, 0.4));
        const objects = [ throne, statue ];

        expect(restsOnRideFurniture(statue, objects)).toBe(false);
        expect(getObjectAltitudeDepth(statue, restsOnRideFurniture(statue, objects))).toBe(0);
    });

    it('a furni carried by a roller keeps its altitude weight', () =>
    {
        const roller = furni(new Vector3d(3, 3, 0), [ 0.636, 0.636 ]);
        const box = furni(new Vector3d(3, 3, 0.5));
        const objects = [ roller, box ];

        expect(restsOnRideFurniture(box, objects)).toBe(true);
        expect(getObjectAltitudeDepth(box, true)).toBeCloseTo(0.5 * OBJECT_ALTITUDE_DEPTH);
    });

    it('the tile cursor on the throne (mouse over the seat) does not count as a roller', () =>
    {
        const throne = furni(new Vector3d(3, 3, 0), [ 0, -0.0219 ], 'throne');
        const cursor = furni(new Vector3d(3, 3, 0), [ 0.7, 0.7 ], 'tile_cursor', false);
        const statue = furni(new Vector3d(3, 3, 0.4));

        expect(restsOnRideFurniture(statue, [ throne, cursor, statue ])).toBe(false);
    });

    it('a roller on another tile does not count', () =>
    {
        const roller = furni(new Vector3d(4, 3, 0), [ 0.636 ]);
        const box = furni(new Vector3d(3, 3, 0.5));

        expect(restsOnRideFurniture(box, [ roller, box ])).toBe(false);
    });

    it('standing units still weigh their altitude', () =>
    {
        const user = furni(new Vector3d(3, 3, 1), [ 0 ], 'user');

        expect(getObjectAltitudeDepth(user, false)).toBeCloseTo(OBJECT_ALTITUDE_DEPTH);
        expect(getObjectAltitudeDepth(user)).toBeCloseTo(OBJECT_ALTITUDE_DEPTH);
    });
});
