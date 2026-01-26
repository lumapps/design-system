import { vi } from 'vitest';
import { isReducedMotion } from './isReducedMotion';

describe('isReducedMotion', () => {
    it('should return true if matchMedia matches', () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn((query) => ({
                matches: query.includes('reduce'),
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
            })),
        );
        expect(isReducedMotion()).toBe(true);
    });

    it('should return false if matchMedia does not match', () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
            })),
        );
        expect(isReducedMotion()).toBe(false);
    });
});
