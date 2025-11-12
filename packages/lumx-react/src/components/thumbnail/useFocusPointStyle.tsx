import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { AspectRatio } from '@lumx/core/js/constants';
import { ThumbnailProps } from '@lumx/react/components/thumbnail/Thumbnail';
import { RectSize } from '@lumx/react/utils/type';

// Calculate shift to center the focus point in the container.
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
}) {
    const scaledSize = imageSize / scale;
    if (scaledSize === containerSize) return 0;

    const scaledFocusHeight = focusPoint * scaledSize;
    const startFocus = scaledFocusHeight - containerSize / 2;
    const shift = startFocus / (scaledSize - containerSize);

    return Math.floor(Math.max(Math.min(shift, 1), 0) * 100);
}

// Compute CSS properties to apply the focus point.
export const useFocusPointStyle = (
    { image, aspectRatio, focusPoint, imgProps: { width, height } = {} }: ThumbnailProps,
    element: HTMLImageElement | undefined,
    isLoaded: boolean,
): CSSProperties => {
    // Get natural image size from imgProps or img element.
    const imageSize: RectSize | undefined = useMemo(() => {
        // Focus point is not applicable => exit early
        if (!image || aspectRatio === AspectRatio.original || (!focusPoint?.x && !focusPoint?.y)) return undefined;
        if (typeof width === 'number' && typeof height === 'number') return { width, height };
        if (element && isLoaded) return { width: element.naturalWidth, height: element.naturalHeight };
        return undefined;
    }, [aspectRatio, element, focusPoint?.x, focusPoint?.y, height, image, isLoaded, width]);

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
    const style: CSSProperties = useMemo(() => {
        // Focus point is not applicable => exit early
        if (!image || aspectRatio === AspectRatio.original || (!focusPoint?.x && !focusPoint?.y)) {
            return {};
        }
        if (!element || !imageSize) {
            // Focus point can be computed but now right now (image size unknown).
            return { visibility: 'hidden' };
        }
        if (!containerSize || !imageSize.height || !imageSize.width) {
            // Missing container or image size abort focus point compute.
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
    }, [aspectRatio, containerSize, element, focusPoint?.x, focusPoint?.y, image, imageSize]);

    return style;
};
