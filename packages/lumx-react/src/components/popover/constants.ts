import { ValueOf } from '@lumx/react/utils/type';

/**
 * Different possible placements for the popover.
 */
export const Placement = {
    AUTO: 'auto',
    AUTO_END: 'auto-end',
    AUTO_START: 'auto-start',

    TOP: 'top',
    TOP_END: 'top-end',
    TOP_START: 'top-start',

    RIGHT: 'right',
    RIGHT_END: 'right-end',
    RIGHT_START: 'right-start',

    BOTTOM: 'bottom',
    BOTTOM_END: 'bottom-end',
    BOTTOM_START: 'bottom-start',

    LEFT: 'left',
    LEFT_END: 'left-end',
    LEFT_START: 'left-start',
} as const;
export type Placement = ValueOf<typeof Placement>;

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

/**
 * Popover fit anchor width options.
 */
export const FitAnchorWidth = {
    MAX_WIDTH: 'maxWidth',
    MIN_WIDTH: 'minWidth',
    WIDTH: 'width',
} as const;
export type FitAnchorWidth = ValueOf<typeof FitAnchorWidth>;

/**
 * Arrow size (in pixel).
 */
export const ARROW_SIZE = 14;

/**
 * Popover default z-index
 */
export const POPOVER_ZINDEX = 9999;
