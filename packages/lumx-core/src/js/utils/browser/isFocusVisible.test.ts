import { vi } from 'vitest';
import { isFocusVisible } from './isFocusVisible';

describe('isFocusVisible', () => {
    it('should return true if matches focus-visible', () => {
        const element = { matches: vi.fn((selector) => selector.includes(':focus-visible')) } as any;
        expect(isFocusVisible(element)).toBe(true);
    });

    it('should return false if does not match', () => {
        const element = { matches: vi.fn(() => false) } as any;
        expect(isFocusVisible(element)).toBe(false);
    });

    it('should fallback to true on error', () => {
        const element = {
            matches: vi.fn(() => {
                throw new Error();
            }),
        } as any;
        expect(isFocusVisible(element)).toBe(true);
    });
});
