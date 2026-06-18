import { describe, it, expect } from 'vitest';
import { getFloatingPlacement } from './getFloatingPlacement';

describe('getFloatingPlacement', () => {
    it('should return undefined for auto placement', () => {
        const result = getFloatingPlacement({ isAuto: true as const });
        expect(result).toBeUndefined();
    });

    it('should return undefined for auto placement with alignment', () => {
        const result = getFloatingPlacement({ isAuto: true as const, autoAlignment: 'start' as const });
        expect(result).toBeUndefined();
    });

    it('should return floatingPlacement for non-auto placement', () => {
        const result = getFloatingPlacement({ floatingPlacement: 'top-start', isAuto: false as const });
        expect(result).toBe('top-start');
    });

    it('should return the exact placement string for bottom', () => {
        const result = getFloatingPlacement({ floatingPlacement: 'bottom', isAuto: false as const });
        expect(result).toBe('bottom');
    });
});
