import { AspectRatio, Size } from '@lumx/react';
import { ValueOf } from '@lumx/react/utils/type';

/**
 *  Focal point using vertical alignment, horizontal alignment or coordinates (from -1 to 1).
 */
export type FocusPoint = { x?: number; y?: number };

/**
 * All available aspect ratios.
 * @deprecated
 */
export const ThumbnailAspectRatio: Record<string, AspectRatio> = { ...AspectRatio };

/**
 *  Thumbnail sizes.
 */
export type ThumbnailSize = Extract<Size, 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>;

/**
 * Thumbnail variants.
 */
export const ThumbnailVariant = {
    squared: 'squared',
    rounded: 'rounded',
} as const;
export type ThumbnailVariant = ValueOf<typeof ThumbnailVariant>;

/**
 * Thumbnail object fit.
 */
export const ThumbnailObjectFit = {
    cover: 'cover',
    contain: 'contain',
} as const;
export type ThumbnailObjectFit = ValueOf<typeof ThumbnailObjectFit>;

export type LoadingState = 'isLoading' | 'isLoaded' | 'hasError';
