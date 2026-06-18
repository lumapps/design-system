import { describe, it, expect } from 'vitest';
import { parseAutoPlacement } from './parseAutoPlacement';

describe('parseAutoPlacement', () => {
    it('should return isAuto true for "auto"', () => {
        const result = parseAutoPlacement('auto');
        expect(result).toEqual({ isAuto: true });
    });

    it('should return isAuto true with start alignment for "auto-start"', () => {
        const result = parseAutoPlacement('auto-start');
        expect(result).toEqual({ isAuto: true, autoAlignment: 'start' });
    });

    it('should return isAuto true with end alignment for "auto-end"', () => {
        const result = parseAutoPlacement('auto-end');
        expect(result).toEqual({ isAuto: true, autoAlignment: 'end' });
    });

    it('should return floatingPlacement for standard placements', () => {
        const result = parseAutoPlacement('top');
        expect(result).toEqual({ floatingPlacement: 'top', isAuto: false });
    });

    it('should return floatingPlacement for compound placements', () => {
        const result = parseAutoPlacement('bottom-end');
        expect(result).toEqual({ floatingPlacement: 'bottom-end', isAuto: false });
    });

    it('should handle undefined placement', () => {
        const result = parseAutoPlacement(undefined);
        expect(result).toEqual({ floatingPlacement: undefined, isAuto: false });
    });
});
