import { describe, expect, it } from 'vitest';
import { resolveRoomCameraAxis } from './RoomCameraAxis';

// ancien calcul de RoomEngine.updateRoomCamera (avant le patch 142), pour un appart plus grand que l'ecran
const legacy = (wanted: number, min: number, max: number, half: number) =>
{
    let value = wanted;
    let limited = false;
    if(value > (max - half)) { value = (max - half); limited = true; }
    if(value < (min + half)) { value = (min + half); limited = true; }
    return { value, limited };
};

describe('BobbaTok patch 142 : camera de l\'appart', () =>
{
    it('centre un petit appart (moins de 70 % de l\'ecran)', () =>
    {
        expect(resolveRoomCameraAxis(9, -4, 6, 10, 600, 1000)).toEqual({ value: 1, centered: true, limited: false });
    });

    it('garde exactement l\'ancien calcul pour un appart plus grand que l\'ecran', () =>
    {
        for(const wanted of [ -30, -12, 0, 5, 18, 40 ])
        {
            const result = resolveRoomCameraAxis(wanted, -20, 25, 8, 3000, 1000);
            const old = legacy(wanted, -20, 25, 8);

            expect(result.value).toBe(old.value);
            expect(result.limited).toBe(old.limited);
            expect(result.centered).toBe(false);
        }
    });

    it('suit l\'avatar dans un appart qui tient mais prend presque tout l\'ecran, sans le couper', () =>
    {
        // appart de -8 a 8 cases, demi-ecran de 10 cases : la camera peut aller de -2 a 2 sans couper l'appart
        expect(resolveRoomCameraAxis(1.5, -8, 8, 10, 850, 1000)).toEqual({ value: 1.5, centered: false, limited: false });
        expect(resolveRoomCameraAxis(7, -8, 8, 10, 850, 1000)).toEqual({ value: 2, centered: false, limited: true });
        expect(resolveRoomCameraAxis(-7, -8, 8, 10, 850, 1000)).toEqual({ value: -2, centered: false, limited: true });
    });
});
