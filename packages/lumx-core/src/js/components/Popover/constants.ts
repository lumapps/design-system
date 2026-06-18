import { Size } from '../../constants/enums';
import { ValueOf } from '../../types/ValueOf';

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

/**
 * Popover height/width sizes
 */
export const POPOVER_SIZES = [Size.m, Size.l, Size.xl, Size.xxl] as const;
