import React from 'react';
import { AspectRatio, Size } from '@lumx/react';

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
export type ThumbnailSize = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 * Thumbnail variants.
 */
export enum ThumbnailVariant {
    squared = 'squared',
    rounded = 'rounded',
}
