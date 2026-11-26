import { describe, expect, it } from 'vitest';
import { RoomObjectVariable } from '@octane/api';
import { Vector3d } from '@octane/utils';
import { getObjectAltitudeDepth, OBJECT_ALTITUDE_DEPTH, restsInsideSeat } from './ObjectAltitudeDepth';

// BobbaTok : seul un mobi pose DANS un siege (statue sur l'assise d'un trone) se trie par ses calques ;
// les blocs empiles ou emboites avec :setz (murs, piliers, mezzanines) gardent le poids de leur hauteur.
const furni = (type: string, location: Vector3d, sizeZ = 1, sizeX = 1, sizeY = 1, direction = 0) => ({
    type,
    getLocation: () => location,
    getDirection: () => new Vector3d(direction, 0, 0),
    model: { getValue: (key: string) => (key === RoomObjectVariable.FURNITURE_SIZE_Z) ? sizeZ : (key === RoomObjectVariable.FURNITURE_SIZE_X) ? sizeX : (key === RoomObjectVariable.FURNITURE_SIZE_Y) ? sizeY : undefined },
    visualization: { sprites: new Map() }
}) as any;

const isSeat = (type: string) => (type === 'throne' || type === 'sofa');
const depth = (object: any, objects: any[]) => getObjectAltitudeDepth(object, restsInsideSeat(object, objects, isSeat) ? false : undefined);

describe('seat stack depth', () =>
{
    it('a statue set down inside a throne sorts by layers (armrests in front)', () =>
    {
        const throne = furni('throne', new Vector3d(3, 3, 0), 1.5);
        const statue = furni('statue', new Vector3d(3, 3, 0.5));

        expect(restsInsideSeat(statue, [ throne, statue ], isSeat)).toBe(true);
        expect(depth(statue, [ throne, statue ])).toBe(0);
    });

    it('a block stacked on a block keeps its altitude weight', () =>
    {
        const lower = furni('block', new Vector3d(5, 5, 0), 1);
        const upper = furni('block', new Vector3d(5, 5, 1));

        expect(depth(upper, [ lower, upper ])).toBeCloseTo(1 * OBJECT_ALTITUDE_DEPTH);
    });

    it('a block sunk a little into another block (:setz) keeps its altitude weight', () =>
    {
        const lower = furni('block', new Vector3d(5, 5, 0), 1);
        const upper = furni('block', new Vector3d(5, 5, 0.7));

        expect(restsInsideSeat(upper, [ lower, upper ], isSeat)).toBe(false);
        expect(depth(upper, [ lower, upper ])).toBeCloseTo(0.7 * OBJECT_ALTITUDE_DEPTH);
    });

    it('a furni put on top of a throne (above its top) keeps its altitude weight', () =>
    {
        const throne = furni('throne', new Vector3d(3, 3, 0), 1.5);
        const lamp = furni('lamp', new Vector3d(3, 3, 1.5));

        expect(restsInsideSeat(lamp, [ throne, lamp ], isSeat)).toBe(false);
    });

    it('the second tile of a turned sofa counts as inside it', () =>
    {
        const sofa = furni('sofa', new Vector3d(2, 2, 0), 1, 2, 1, 90);
        const teddy = furni('teddy', new Vector3d(2, 3, 0.4));

        expect(restsInsideSeat(teddy, [ sofa, teddy ], isSeat)).toBe(true);
    });

    it('on another tile, a seat changes nothing', () =>
    {
        const throne = furni('throne', new Vector3d(3, 3, 0), 1.5);
        const statue = furni('statue', new Vector3d(4, 3, 0.5));

        expect(restsInsideSeat(statue, [ throne, statue ], isSeat)).toBe(false);
    });
});
