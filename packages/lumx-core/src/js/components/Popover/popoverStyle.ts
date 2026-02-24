/* eslint-disable no-param-reassign */
import {
    offset as offsetMiddleware,
    flip,
    shift,
    size,
    arrow as arrowMiddleware,
    autoPlacement,
    type Middleware,
    type Placement as FloatingPlacement,
    type MiddlewareData,
} from '@floating-ui/dom';

import { ARROW_SIZE, FitAnchorWidth, type Offset, type Placement } from './constants';

/**
 * Parse a Popover placement into floating-ui placement or auto-placement config.
 */
export function parseAutoPlacement(placement?: Placement) {
    if (placement === 'auto') return { isAuto: true as const };
    if (placement === 'auto-start') return { isAuto: true as const, autoAlignment: 'start' as const };
    if (placement === 'auto-end') return { isAuto: true as const, autoAlignment: 'end' as const };
    return { floatingPlacement: placement as FloatingPlacement, isAuto: false as const };
}

/**
 * Parse the fitToAnchorWidth option into the CSS property name to apply.
 */
export function parseFitWidth(fitToAnchorWidth?: string | boolean): string | undefined {
    if (!fitToAnchorWidth) return undefined;
    if (typeof fitToAnchorWidth === 'string') return fitToAnchorWidth;
    return FitAnchorWidth.MIN_WIDTH;
}

export interface BuildPopoverMiddlewareOptions {
    /** Offset from the anchor element. */
    offset?: Offset;
    /** Whether the popover has an arrow. */
    hasArrow?: boolean;
    /** CSS property to fit to anchor width ('minWidth', 'maxWidth', 'width'). Already parsed via `parseFitWidth`. */
    fitWidth?: string;
    /** Whether to constrain height to viewport. */
    fitWithinViewportHeight?: boolean;
    /** Boundary element for overflow detection. */
    boundary?: HTMLElement;
    /** Parsed placement result from `parseAutoPlacement`. */
    parsedPlacement: ReturnType<typeof parseAutoPlacement>;
    /** Arrow element (required when hasArrow is true). */
    arrowElement?: HTMLElement | null;
}

/**
 * Build the floating-ui middleware array for popover positioning.
 *
 * Middleware order: offset → flip/autoPlacement → shift → size → arrow
 */
export function buildPopoverMiddleware(options: BuildPopoverMiddlewareOptions): Middleware[] {
    const { offset, hasArrow, fitWidth, fitWithinViewportHeight, boundary, parsedPlacement, arrowElement } = options;

    const middlewares: Middleware[] = [];

    // Offset middleware
    const awayOffset = (offset?.away ?? 0) + (hasArrow ? ARROW_SIZE : 0);
    const alongOffset = offset?.along ?? 0;
    middlewares.push(offsetMiddleware({ mainAxis: awayOffset, crossAxis: alongOffset }));

    // Positioning middlewares
    if (parsedPlacement.isAuto) {
        middlewares.push(
            autoPlacement({ ...(boundary ? { boundary } : {}), alignment: parsedPlacement.autoAlignment }),
        );
    } else {
        middlewares.push(flip(boundary ? { boundary } : {}));
        middlewares.push(shift(boundary ? { boundary } : {}));
    }

    // Size middleware
    if (fitWidth || fitWithinViewportHeight) {
        middlewares.push(
            size({
                ...(boundary ? { boundary } : {}),
                apply({ availableHeight, rects, elements }) {
                    if (fitWidth) {
                        Object.assign(elements.floating.style, { [fitWidth]: `${rects.reference.width}px` });
                    }
                    if (fitWithinViewportHeight) {
                        elements.floating.style.maxHeight = `${Math.max(0, availableHeight - ARROW_SIZE)}px`;
                    }
                },
            }),
        );
    }

    // Arrow middleware
    if (hasArrow && arrowElement) {
        middlewares.push(arrowMiddleware({ element: arrowElement, padding: ARROW_SIZE / 2 }));
    }

    return middlewares;
}

/**
 * Compute arrow CSS styles from floating-ui middleware data.
 */
export function computeArrowStyles(arrowData?: MiddlewareData['arrow']): Record<string, string> | undefined {
    if (!arrowData) return undefined;
    return {
        left: arrowData.x != null ? `${arrowData.x}px` : '',
        top: arrowData.y != null ? `${arrowData.y}px` : '',
    };
}

/**
 * Get the floating-ui placement from the parsed placement config.
 * Returns undefined for auto-placement (floating-ui handles it via autoPlacement middleware).
 */
export function getFloatingPlacement(
    parsedPlacement: ReturnType<typeof parseAutoPlacement>,
): FloatingPlacement | undefined {
    return parsedPlacement.isAuto ? undefined : parsedPlacement.floatingPlacement;
}
