// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { computePosition } from '@floating-ui/dom';

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

describe('size middleware apply', () => {
    const baseOptions: BuildPopoverMiddlewareOptions = {
        parsedPlacement: { floatingPlacement: 'bottom', isAuto: false as const },
    };

    async function runPosition(options: Partial<BuildPopoverMiddlewareOptions> & { referenceWidth?: number }) {
        const reference = document.createElement('div');
        const floating = document.createElement('div');
        reference.getBoundingClientRect = () =>
            ({
                x: 0,
                y: 0,
                width: options.referenceWidth ?? 200,
                height: 20,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            }) as DOMRect;

        const middlewares = buildPopoverMiddleware({
            ...baseOptions,
            ...options,
        });

        await computePosition(reference, floating, {
            placement: 'bottom',
            middleware: middlewares,
        });

        return floating.style;
    }

    describe('width', () => {
        it('should set width to anchor width when fitWidth is "width"', async () => {
            const style = await runPosition({ fitWidth: 'width', referenceWidth: 150 });
            expect(style.width).toBe('150px');
        });

        it('should set minWidth to anchor width when fitWidth is "minWidth" without explicit minWidth', async () => {
            const style = await runPosition({ fitWidth: 'minWidth', referenceWidth: 150 });
            expect(style.minWidth).toBe('150px');
        });

        it('should set maxWidth to anchor width when fitWidth is "maxWidth" without explicit maxWidth', async () => {
            const style = await runPosition({ fitWidth: 'maxWidth', referenceWidth: 150 });
            expect(style.maxWidth).toBe('150px');
        });

        it('should prefer explicit width over fitWidth', async () => {
            const style = await runPosition({ width: '250px', fitWidth: 'width', referenceWidth: 150 });
            expect(style.width).toBe('250px');
        });

        it('should resolve t-shirt size to CSS variable for width', async () => {
            const style = await runPosition({ width: 'm' });
            expect(style.width).toBe('var(--lumx-size-m)');
        });

        it('should combine anchor minWidth with explicit t-shirt minWidth', async () => {
            const style = await runPosition({
                fitWidth: 'minWidth',
                minWidth: 'l',
                referenceWidth: 150,
            });
            expect(style.minWidth).toBe('max(var(--lumx-size-l), 150px)');
        });

        it('should combine anchor maxWidth with explicit t-shirt maxWidth', async () => {
            const style = await runPosition({
                fitWidth: 'maxWidth',
                maxWidth: 'm',
                referenceWidth: 150,
            });
            expect(style.maxWidth).toBe('min(var(--lumx-size-m), 150px)');
        });

        it('should resolve explicit maxWidth CSS variable without fitWidth', async () => {
            const style = await runPosition({ maxWidth: 'm' });
            expect(style.maxWidth).toBe('var(--lumx-size-m)');
        });
    });

    describe('height', () => {
        it('should set height when provided', async () => {
            const style = await runPosition({ height: '300px' });
            expect(style.height).toBe('300px');
        });

        it('should set minHeight when provided', async () => {
            const style = await runPosition({ minHeight: '100px' });
            expect(style.minHeight).toBe('100px');
        });

        it('should resolve t-shirt size for height', async () => {
            const style = await runPosition({ height: 'xl' });
            expect(style.height).toBe('var(--lumx-size-xl)');
        });

        it('should set maxHeight from explicit value when fitWithinViewportHeight is false', async () => {
            const style = await runPosition({ maxHeight: '200px' });
            expect(style.maxHeight).toBe('200px');
        });

        it('should combine viewport constraint with maxHeight when fitWithinViewportHeight is true', async () => {
            const style = await runPosition({ maxHeight: '200px', fitWithinViewportHeight: true });
            expect(style.maxHeight).toBe('calc(0px)');
        });

        it('should only use viewport constraint when maxHeight is not set and fitWithinViewportHeight is true', async () => {
            const style = await runPosition({ fitWithinViewportHeight: true });
            expect(style.maxHeight).toBe('0px');
        });

        it('should resolve t-shirt maxHeight to CSS variable', async () => {
            const style = await runPosition({ maxHeight: 'm' });
            expect(style.maxHeight).toBe('var(--lumx-size-m)');
        });
    });
});
