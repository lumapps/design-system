import type { CSSProperties } from 'react';
import type { RectSize } from '../../types';
import { AspectRatio } from '../../constants';
import type { FocusPoint, LoadingState } from './types';

/**
 * Determines the loading state of an HTML image element.
 *
 * @param img - The HTML image element to check
 * @param event - Optional event (load or error) that triggered the state check
 * @returns The current loading state: 'hasError', 'isLoading', or 'isLoaded'
 */
export function getImageLoadingState(img: HTMLImageElement | null | undefined, event?: Event): LoadingState {
    // Error event occurred or image has no source.
    if (event?.type === 'error' || (img?.complete && !img.getAttribute('src'))) {
        return 'hasError';
    }
    // Image is undefined or incomplete.
    if (!img || !img.complete) {
        return 'isLoading';
    }
    // Else loaded.
    return 'isLoaded';
}

/**
 * Parameters for getting image size.
 */
export interface GetImageSizeParams {
    /** Image URL (used for validation) */
    image?: string;
    /** Aspect ratio setting */
    aspectRatio?: AspectRatio;
    /** Focus point (if not set, size calculation is skipped) */
    focusPoint?: FocusPoint;
    /** Width from imgProps */
    width?: number;
    /** Height from imgProps */
    height?: number;
    /** Image element (for getting natural dimensions) */
    element?: HTMLImageElement;
    /** Whether image is loaded */
    isLoaded: boolean;
}

/**
 * Gets the natural image size from props or element.
 * Returns undefined if focus point is not applicable or size cannot be determined.
 *
 * @param params - Image size parameters
 * @returns Image size or undefined
 */
export function getImageSize({
    image,
    aspectRatio,
    focusPoint,
    width,
    height,
    element,
    isLoaded,
}: GetImageSizeParams): RectSize | undefined {
    // Focus point is not applicable => exit early
    if (!image || aspectRatio === AspectRatio.original || (!focusPoint?.x && !focusPoint?.y)) {
        return undefined;
    }
    // Size provided via props
    if (typeof width === 'number' && typeof height === 'number') {
        return { width, height };
    }
    // Size from loaded element
    if (element && isLoaded) {
        return { width: element.naturalWidth, height: element.naturalHeight };
    }
    return undefined;
}

/**
 * Calculate shift position to center the focus point in the container.
 *
 * This function computes the percentage offset needed to position an image
 * such that a specific focus point on the image aligns with the center of
 * the container, taking into account the image's scale.
 *
 * @param params - Focus point shift calculation parameters
 * @returns Percentage shift (0-100) for CSS positioning
 */
export function shiftPosition({
    scale,
    focusPoint,
    imageSize,
    containerSize,
}: {
    scale: number;
    focusPoint: number;
    imageSize: number;
    containerSize: number;
}): number {
    const scaledSize = imageSize / scale;
    if (scaledSize === containerSize) return 0;

    const scaledFocusHeight = focusPoint * scaledSize;
    const startFocus = scaledFocusHeight - containerSize / 2;
    const shift = startFocus / (scaledSize - containerSize);

    return Math.floor(Math.max(Math.min(shift, 1), 0) * 100);
}

/**
 * Parameters for calculating focus point style.
 */
export interface CalculateFocusPointStyleParams {
    /** Image URL */
    image?: string;
    /** Aspect ratio */
    aspectRatio?: AspectRatio;
    /** Focus point */
    focusPoint?: FocusPoint;
    /** Image element (for validation) */
    element?: HTMLImageElement;
    /** Natural image size */
    imageSize?: RectSize;
    /** Container size */
    containerSize?: RectSize;
}

/**
 * Calculates CSS style for applying focus point positioning.
 *
 * @param params - Focus point style parameters
 * @returns CSS properties to apply to the image
 */
export function calculateFocusPointStyle({
    image,
    aspectRatio,
    focusPoint,
    element,
    imageSize,
    containerSize,
}: CalculateFocusPointStyleParams): CSSProperties {
    // Focus point is not applicable => exit early
    if (!image || aspectRatio === AspectRatio.original || (!focusPoint?.x && !focusPoint?.y)) {
        return {};
    }

    if (!element || !imageSize) {
        // Focus point can be computed but not right now (image size unknown).
        return { visibility: 'hidden' };
    }

    if (!containerSize || !imageSize.height || !imageSize.width) {
        // Missing container or image size, abort focus point compute.
        return {};
    }

    const heightScale = imageSize.height / containerSize.height;
    const widthScale = imageSize.width / containerSize.width;
    const scale = Math.min(widthScale, heightScale);

    // Focus Y relative to the top (instead of the center)
    const focusPointFromTop = Math.abs((focusPoint?.y || 0) - 1) / 2;
    const y = shiftPosition({
        scale,
        focusPoint: focusPointFromTop,
        imageSize: imageSize.height,
        containerSize: containerSize.height,
    });

    // Focus X relative to the left (instead of the center)
    const focusPointFromLeft = Math.abs((focusPoint?.x || 0) + 1) / 2;
    const x = shiftPosition({
        scale,
        focusPoint: focusPointFromLeft,
        imageSize: imageSize.width,
        containerSize: containerSize.width,
    });

    const objectPosition = `${x}% ${y}%`;

    return { objectPosition };
}
