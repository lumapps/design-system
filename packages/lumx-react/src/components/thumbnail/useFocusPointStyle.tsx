import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { getImageSize, calculateFocusPointStyle } from '@lumx/core/js/components/Thumbnail';
import { RectSize } from '@lumx/core/js/types';
import { ThumbnailProps } from './Thumbnail';

// Compute CSS properties to apply the focus point.
export const useFocusPointStyle = (
    { image, aspectRatio, focusPoint, imgProps: { width, height } = {} }: ThumbnailProps,
    element: HTMLImageElement | undefined,
    isLoaded: boolean,
): CSSProperties => {
    // Get natural image size from imgProps or img element.
    const imageSize: RectSize | undefined = useMemo(
        () =>
            getImageSize({
                image,
                aspectRatio,
                focusPoint,
                width: typeof width === 'number' ? width : undefined,
                height: typeof height === 'number' ? height : undefined,
                element,
                isLoaded,
            }),
        [aspectRatio, element, focusPoint, height, image, isLoaded, width],
    );

    // Get container size (dependant on imageSize).
    const [containerSize, setContainerSize] = useState<RectSize | undefined>(undefined);
    useEffect(
        function updateContainerSize() {
            const cWidth = element?.offsetWidth;
            const cHeight = element?.offsetHeight;
            if (cWidth && cHeight) {
                // Update only if needed.
                setContainerSize((oldContainerSize) =>
                    oldContainerSize?.width === cWidth && oldContainerSize.height === cHeight
                        ? oldContainerSize
                        : { width: cWidth, height: cHeight },
                );
            } else if (imageSize) {
                // Wait for a render (in case the container size is dependent on the image size).
                requestAnimationFrame(updateContainerSize);
            }
        },
        [element?.offsetHeight, element?.offsetWidth, imageSize],
    );

    // Compute style.
    const style: CSSProperties = useMemo(
        () =>
            calculateFocusPointStyle({
                image,
                aspectRatio,
                focusPoint,
                element,
                imageSize,
                containerSize,
            }),
        [aspectRatio, containerSize, element, focusPoint, image, imageSize],
    );

    return style;
};
