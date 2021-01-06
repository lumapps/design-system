import React from 'react';
import { AspectRatio, Size } from '@lumx/react';
import { ValueOf } from '@lumx/react/utils';

/**
 *  Focal point using vertical alignment, horizontal alignment or coordinates (from -1 to 1).
 */
export type FocusPoint = { x?: number; y?: number };

/**
 * Loading attribute is not yet supported in typescript, so we need
 * to add it in order to avoid a ts error.
 * https://github.com/typescript-cheatsheets/react-typescript-cheatsheet/blob/master/ADVANCED.md#adding-non-standard-attributes
 */
declare module 'react' {
    interface ImgHTMLAttributes<T> extends React.HTMLAttributes<T> {
        loading?: 'eager' | 'lazy';
    }
}

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
