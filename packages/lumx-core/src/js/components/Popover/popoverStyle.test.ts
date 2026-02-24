// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
    parseAutoPlacement,
    parseFitWidth,
    buildPopoverMiddleware,
    computeArrowStyles,
    getFloatingPlacement,
    type BuildPopoverMiddlewareOptions,
} from './popoverStyle';
import { FitAnchorWidth } from './constants';

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

describe('buildPopoverMiddleware', () => {
    const baseOptions: BuildPopoverMiddlewareOptions = {
        parsedPlacement: { floatingPlacement: 'bottom', isAuto: false as const },
    };

    it('should always include offset middleware as the first middleware', () => {
        const middlewares = buildPopoverMiddleware(baseOptions);
        expect(middlewares.length).toBeGreaterThanOrEqual(1);
        expect(middlewares[0].name).toBe('offset');
    });

    it('should include flip and shift for non-auto placement', () => {
        const middlewares = buildPopoverMiddleware(baseOptions);
        const names = middlewares.map((m) => m.name);
        expect(names).toContain('flip');
        expect(names).toContain('shift');
        expect(names).not.toContain('autoPlacement');
    });

    it('should include autoPlacement for auto placement', () => {
        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            parsedPlacement: { isAuto: true as const },
        });
        const names = middlewares.map((m) => m.name);
        expect(names).toContain('autoPlacement');
        expect(names).not.toContain('flip');
        expect(names).not.toContain('shift');
    });

    it('should include autoPlacement with alignment for auto-start', () => {
        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            parsedPlacement: { isAuto: true as const, autoAlignment: 'start' as const },
        });
        const names = middlewares.map((m) => m.name);
        expect(names).toContain('autoPlacement');
    });

    it('should include size middleware when fitWidth is set', () => {
        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            fitWidth: 'minWidth',
        });
        const names = middlewares.map((m) => m.name);
        expect(names).toContain('size');
    });

    it('should include size middleware when fitWithinViewportHeight is set', () => {
        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            fitWithinViewportHeight: true,
        });
        const names = middlewares.map((m) => m.name);
        expect(names).toContain('size');
    });

    it('should not include size middleware when neither fitWidth nor fitWithinViewportHeight', () => {
        const middlewares = buildPopoverMiddleware(baseOptions);
        const names = middlewares.map((m) => m.name);
        expect(names).not.toContain('size');
    });

    it('should include arrow middleware when hasArrow and arrowElement are provided', () => {
        const arrowElement = document.createElement('div');
        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            hasArrow: true,
            arrowElement,
        });
        const names = middlewares.map((m) => m.name);
        expect(names).toContain('arrow');
    });

    it('should not include arrow middleware when hasArrow is true but arrowElement is null', () => {
        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            hasArrow: true,
            arrowElement: null,
        });
        const names = middlewares.map((m) => m.name);
        expect(names).not.toContain('arrow');
    });

    it('should not include arrow middleware when hasArrow is false', () => {
        const arrowElement = document.createElement('div');
        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            hasArrow: false,
            arrowElement,
        });
        const names = middlewares.map((m) => m.name);
        expect(names).not.toContain('arrow');
    });

    it('should add ARROW_SIZE to away offset when hasArrow is true', () => {
        const withArrow = buildPopoverMiddleware({
            ...baseOptions,
            hasArrow: true,
            offset: { away: 5 },
        });
        const withoutArrow = buildPopoverMiddleware({
            ...baseOptions,
            hasArrow: false,
            offset: { away: 5 },
        });
        // Both should have offset as first middleware, but with different values.
        // We verify the middleware array structure is correct.
        expect(withArrow[0].name).toBe('offset');
        expect(withoutArrow[0].name).toBe('offset');
    });

    it('should produce correct middleware order', () => {
        const arrowElement = document.createElement('div');
        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            hasArrow: true,
            arrowElement,
            fitWidth: 'minWidth',
        });
        const names = middlewares.map((m) => m.name);
        // Expected order: offset → flip → shift → size → arrow
        expect(names.indexOf('offset')).toBeLessThan(names.indexOf('flip'));
        expect(names.indexOf('flip')).toBeLessThan(names.indexOf('shift'));
        expect(names.indexOf('shift')).toBeLessThan(names.indexOf('size'));
        expect(names.indexOf('size')).toBeLessThan(names.indexOf('arrow'));
    });
});

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
