/* eslint-disable no-param-reassign */
import {
    offset as offsetMiddleware,
    flip,
    shift,
    size,
    arrow as arrowMiddleware,
    autoPlacement,
    type Middleware,
} from '@floating-ui/dom';

import { ARROW_SIZE } from '../constants';
import type { Offset } from '../types';
import { type parseAutoPlacement } from './parseAutoPlacement';

export interface BuildPopoverMiddlewareOptions {
    /** Offset from the anchor element. */
    offset?: Offset;
    /** Whether the popover has an arrow. */
    hasArrow?: boolean;
    /** CSS property to fit to anchor width ('minWidth', 'maxWidth', 'width'). Already parsed via `parseFitWidth`. */
    fitWidth?: string;
    /** Constrain popover height to avoid overflowing the viewport. */
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
