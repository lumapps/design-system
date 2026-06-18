import { describe, it, expect } from 'vitest';
import { computeArrowStyles } from './computeArrowStyles';

describe('computeArrowStyles', () => {
    it('should return undefined when no arrow data is provided', () => {
        expect(computeArrowStyles(undefined)).toBeUndefined();
    });

    it('should return left and top styles from x and y values', () => {
        const result = computeArrowStyles({ x: 10, y: 20, centerOffset: 0 });
        expect(result).toEqual({ left: '10px', top: '20px' });
    });

    it('should return empty string for missing x value', () => {
        const result = computeArrowStyles({ x: undefined, y: 5, centerOffset: 0 });
        expect(result).toEqual({ left: '', top: '5px' });
    });

    it('should return empty string for missing y value', () => {
        const result = computeArrowStyles({ x: 8, y: undefined, centerOffset: 0 });
        expect(result).toEqual({ left: '8px', top: '' });
    });

    it('should handle x and y both as 0', () => {
        const result = computeArrowStyles({ x: 0, y: 0, centerOffset: 0 });
        expect(result).toEqual({ left: '0px', top: '0px' });
    });
});
