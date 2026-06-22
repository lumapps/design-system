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
import type { Offset, PopoverSizes } from '../types';
import type { PXSize } from '../../../utils/browser/css/types';
import { resolveCssSize } from '../../../utils/browser/css/resolveCssSize';
import { cssMin, cssMax } from '../../../utils/browser/css/combineSize';
import { type parseAutoPlacement } from './parseAutoPlacement';

export interface BuildPopoverMiddlewareOptions extends PopoverSizes {
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
    const {
        offset,
        hasArrow,
        fitWidth,
        fitWithinViewportHeight,
        width: rawWidth,
        minWidth: rawMinWidth,
        maxWidth: rawMaxWidth,
        height: rawHeight,
        minHeight: rawMinHeight,
        maxHeight: rawMaxHeight,
        boundary,
        parsedPlacement,
        arrowElement,
    } = options;

    // Resolve t-shirt sizes to CSS pixel strings for the apply callback.
    const width = resolveCssSize(rawWidth);
    const minWidth = resolveCssSize(rawMinWidth);
    const maxWidth = resolveCssSize(rawMaxWidth);
    const height = resolveCssSize(rawHeight);
    const minHeight = resolveCssSize(rawMinHeight);
    const maxHeight = resolveCssSize(rawMaxHeight);

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

    // Size middleware — always required when any sizing constraint is set
    const anySizeConstraint =
        !!fitWidth || !!fitWithinViewportHeight || width || minWidth || maxWidth || height || minHeight || maxHeight;

    if (anySizeConstraint) {
        middlewares.push(
            size({
                ...(boundary ? { boundary } : {}),
                apply({ availableHeight, rects, elements }) {
                    const anchorWidth: PXSize = `${rects.reference.width}px`;

                    // Width: explicit width wins, else fitToAnchorWidth.
                    elements.floating.style.width = width || (fitWidth === 'width' ? anchorWidth : '');
                    // Min-width: anchor constrained by explicit min-width.
                    elements.floating.style.minWidth = cssMax(minWidth, fitWidth === 'minWidth' ? anchorWidth : '');
                    // Max-width: anchor constrained by explicit max-width.
                    elements.floating.style.maxWidth = cssMin(maxWidth, fitWidth === 'maxWidth' ? anchorWidth : '');

                    // Height: explicit values only.
                    elements.floating.style.height = height || '';
                    elements.floating.style.minHeight = minHeight || '';
                    // Max-height: viewport combined with explicit max-height.
                    const adaptedAvailableHeight: PXSize = `${Math.max(0, availableHeight - ARROW_SIZE)}px`;
                    elements.floating.style.maxHeight = cssMin(
                        maxHeight,
                        fitWithinViewportHeight ? adaptedAvailableHeight : '',
                    );
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
