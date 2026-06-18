// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { buildPopoverMiddleware, type BuildPopoverMiddlewareOptions } from './buildPopoverMiddleware';

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
        expect(names.indexOf('offset')).toBeLessThan(names.indexOf('flip'));
        expect(names.indexOf('flip')).toBeLessThan(names.indexOf('shift'));
        expect(names.indexOf('shift')).toBeLessThan(names.indexOf('size'));
        expect(names.indexOf('size')).toBeLessThan(names.indexOf('arrow'));
    });
});
