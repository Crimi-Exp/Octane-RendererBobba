import { describe, expect, it } from 'vitest';
import { AvatarFigureContainer } from './AvatarFigureContainer';

describe('AvatarFigureContainer : vetements superposes', () => {
    it('garde la premiere piece comme principale et les suivantes en couches', () => {
        const c = new AvatarFigureContainer('hr-100-61.hd-180-1.hr-515-45.ch-210-66.hr-3-1-2');

        expect(c.getPartSetId('hr')).toBe(100);
        expect(c.getPartColorIds('hr')).toEqual([61]);
        expect(c.getPartLayers('hr')).toEqual([{ setId: 515, colorIds: [45] }, { setId: 3, colorIds: [1, 2] }]);
        expect(Array.from(c.getPartTypeIds())).toEqual(['hr', 'hd', 'ch']);
    });

    it('ressort la meme tenue (aller-retour)', () => {
        const c = new AvatarFigureContainer('hr-100-61.hr-515-45.hd-180-1.ch-210-66');

        expect(c.getFigureString()).toBe('hr-100-61.hr-515-45.hd-180-1.ch-210-66');
    });

    it('une tenue sans couche est inchangee', () => {
        const c = new AvatarFigureContainer('hr-100-61.hd-180-1');

        expect(c.getPartLayers('hr')).toEqual([]);
        expect(c.getFigureString()).toBe('hr-100-61.hd-180-1');
    });

    it('removePart retire aussi les couches', () => {
        const c = new AvatarFigureContainer('hr-100-61.hr-515-45.hd-180-1');

        c.removePart('hr');

        expect(c.getFigureString()).toBe('hd-180-1');
    });
});
