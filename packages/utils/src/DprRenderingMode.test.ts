import { describe, expect, it } from 'vitest';
import { ResolveDesiredResolution } from './DprRenderingMode';

describe('ResolveDesiredResolution', () => {
    it('keeps the screen density on desktop', () => {
        expect(ResolveDesiredResolution(1, false)).toBe(1);
        expect(ResolveDesiredResolution(2, false)).toBe(2);
        expect(ResolveDesiredResolution(3, false)).toBe(3);
        expect(ResolveDesiredResolution(1.5, false)).toBe(1);
    });

    it('caps phones and tablets at x2', () => {
        expect(ResolveDesiredResolution(3, true)).toBe(3);
        expect(ResolveDesiredResolution(2, true)).toBe(2);
        expect(ResolveDesiredResolution(1, true)).toBe(1);
    });
});
