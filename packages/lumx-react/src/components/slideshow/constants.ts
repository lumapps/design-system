import type { ValueOf } from '@lumx/core/js/types';

/**
 * Autoplay default interval in ms.
 */
export const AUTOPLAY_DEFAULT_INTERVAL = 5000;

/**
 * Full width size in percent.
 */
export const FULL_WIDTH_PERCENT = 100;

/**
 * Edge from the active index.
 */
export const EDGE_FROM_ACTIVE_INDEX = 2;

/**
 * Max number of pagination items.
 */
export const PAGINATION_ITEMS_MAX = 5;

/**
 * Size of a pagination item. Used to translate wrapper.
 */
export const PAGINATION_ITEM_SIZE = 12;

/**
 * Slide mode
 */
export const SlideMode = {
    /** Move slides with CSS transform translate */
    transformTranslate: 'transform-translate',
    /** Move slides native scroll snap (available only on supported browsers) */
    scrollSnap: 'scroll-snap',
} as const;
export type SlideMode = ValueOf<typeof SlideMode>;
