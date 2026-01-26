import { vi } from 'vitest';
import { mergeRefs } from './mergeRefs';

describe('mergeRefs', () => {
    it('should update multiple refs', () => {
        const ref1 = { current: null };
        const ref2 = vi.fn();
        const merged = mergeRefs(ref1 as any, ref2);

        const element = document.createElement('div');
        merged(element);

        expect(ref1.current).toBe(element);
        expect(ref2).toHaveBeenCalledWith(element);
    });
});
