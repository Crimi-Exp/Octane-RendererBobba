import { AvatarAction } from '@octane/api';
import { describe, expect, it } from 'vitest';
import { Animation } from '../animation/Animation';
import { DanceSixSevenAnimation } from './DanceSixSevenAnimation';

describe('geste « 67 » (Habbo AIR)', () => {
    it('maps expression 67 to the sixseven dance for 990 ms', () => {
        expect(AvatarAction.getExpression(67)).toBe(AvatarAction.EXPRESSION_67);
        expect(AvatarAction.getExpressionId(AvatarAction.EXPRESSION_67)).toBe(67);
        expect(AvatarAction.getExpressionTimeout(67)).toBe(990);
        expect(AvatarAction.getExpression(1)).toBe(AvatarAction.EXPRESSION_WAVE);
    });

    it('keeps the 14 official frames of dance_sixseven_xml', () => {
        const structure = { getActionDefinition: (id: string) => ({ id, state: id }) } as any;
        const animation = new Animation(structure, DanceSixSevenAnimation);

        expect(animation.id).toBe('dance.sixseven');
        expect(animation.frameCount()).toBe(14);
        expect(DanceSixSevenAnimation.frames[4].bodyparts.find(part => part.id === 'head')?.action).toBe('Talk');
    });
});
