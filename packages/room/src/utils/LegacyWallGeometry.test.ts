import { describe, expect, it } from 'vitest';
import { LegacyWallGeometry } from './LegacyWallGeometry';

const geometryOf = (rows: number[][]): LegacyWallGeometry =>
{
    const geometry = new LegacyWallGeometry();

    geometry.initialize(rows[0].length, rows.length, 0);
    rows.forEach((row, y) => row.forEach((height, x) => geometry.setHeight(x, y, height)));

    return geometry;
};

describe('LegacyWallGeometry.getFloorAltitude', () =>
{
    it('lifts a tile half a step when a neighbour is one higher', () =>
    {
        const geometry = geometryOf([[ 0, 0, 0 ], [ 0, 0, 1 ], [ 0, 0, 0 ]]);

        expect(geometry.getFloorAltitude(1, 1)).toBe(0.5);
        expect(geometry.getFloorAltitude(0, 0)).toBe(0);
        expect(geometry.getFloorAltitude(2, 1)).toBe(1);
    });

    it('rounds only the own tile down, like Flash', () =>
    {
        const geometry = geometryOf([[ 0, 0, 0 ], [ 0, 1.5, 0 ], [ 0, 0, 2.5 ]]);

        expect(geometry.getFloorAltitude(1, 1)).toBe(1);
        expect(geometry.getFloorAltitude(0, 0)).toBe(0);
    });
});
