import type { VHSize, PXSize } from '../../utils/browser/css/types';
import type { POPOVER_SIZES } from './constants';

/**
 * Offset of the popover.
 */
export interface Offset {
    /** Offset size along the reference. */
    along?: number;
    /** Offset size away from the reference. */
    away?: number;
}

/**
 * Popover elevation index.
 */
export type Elevation = 1 | 2 | 3 | 4 | 5;

/** Popover size value — pixel value, or "t-shirt" size token. */
export type PopoverSize = PXSize | (typeof POPOVER_SIZES)[number];

/** Popover height value — extends PopoverSize with viewport-relative unit. */
export type PopoverHeight = PopoverSize | VHSize;

/** Popover width value — same as PopoverSize (pixels or t-shirt only). */
export type PopoverWidth = PopoverSize;

export interface PopoverSizes {
    /** Exact width (pixels or t-shirt size). Combines with `fitToAnchorWidth`: if both target the same CSS property, the explicit prop wins for `width`. */
    width?: PopoverWidth;
    /** Minimum width (pixels or t-shirt size). Combines with `fitToAnchorWidth='minWidth'` as `max(anchor, value)`. */
    minWidth?: PopoverWidth;
    /** Maximum width (pixels or t-shirt size). Combines with `fitToAnchorWidth='maxWidth'` as `min(anchor, value)`. */
    maxWidth?: PopoverWidth;
    /** Exact height (pixels, vh, or t-shirt size). */
    height?: PopoverHeight;
    /** Minimum height (pixels, vh, or t-shirt size). */
    minHeight?: PopoverHeight;
    /** Maximum height (pixels, vh, or t-shirt size). Combines with `fitWithinViewportHeight` as `min(maxHeight, available)`. */
    maxHeight?: PopoverHeight;
}
