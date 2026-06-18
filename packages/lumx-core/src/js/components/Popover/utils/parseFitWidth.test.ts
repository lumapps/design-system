import { describe, it, expect } from 'vitest';
import { parseFitWidth } from './parseFitWidth';
import { FitAnchorWidth } from '../constants';

describe('parseFitWidth', () => {
    it('should return undefined for undefined', () => {
        expect(parseFitWidth(undefined)).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
        expect(parseFitWidth('')).toBeUndefined();
    });

    it('should return undefined for false', () => {
        expect(parseFitWidth(false as unknown as string | boolean)).toBeUndefined();
    });

    it('should return MIN_WIDTH for boolean true', () => {
        expect(parseFitWidth(true as unknown as string | boolean)).toBe(FitAnchorWidth.MIN_WIDTH);
    });

    it('should return the string value when a string is provided', () => {
        expect(parseFitWidth('maxWidth')).toBe('maxWidth');
        expect(parseFitWidth('width')).toBe('width');
    });
});
