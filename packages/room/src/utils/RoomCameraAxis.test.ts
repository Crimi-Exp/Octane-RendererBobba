import { describe, expect, it } from 'vitest';
import { resolveRoomCameraAxis } from './RoomCameraAxis';

describe('BobbaTok patch 142 / 143 / 144 : camera de l\'appart', () =>
{
    it('suit toujours l\'avatar, meme dans un petit appart', () =>
    {
        expect(resolveRoomCameraAxis(9, -4, 6, 10, 300, 1000)).toEqual({ value: 9, centered: false, limited: false });
    });

    it('suit l\'avatar dans un grand appart, meme pres du bord', () =>
    {
        for(const wanted of [ -30, -12, 0, 5, 18, 40 ])
        {
            expect(resolveRoomCameraAxis(wanted, -20, 25, 8, 3000, 1000)).toEqual({ value: wanted, centered: false, limited: false });
        }
    });

    it('peut encore centrer les petits apparts si on remonte le reglage', () =>
    {
        expect(resolveRoomCameraAxis(9, -4, 6, 10, 600, 1000, 0.7)).toEqual({ value: 1, centered: true, limited: false });
    });
});
