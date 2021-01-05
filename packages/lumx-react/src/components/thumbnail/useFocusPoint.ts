import { CSSProperties, MutableRefObject, RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useOnResize } from '@lumx/react/hooks/useOnResize';
import { AspectRatio } from '@lumx/react';
import { clamp } from '@lumx/react/utils/clamp';
import { LoadingState } from '@lumx/react/components/thumbnail/useImageLoad';
import { Callback } from '@lumx/react/utils';
import { isEqual } from 'lodash';
import { FocusPoint } from './types';

const IMG_STYLES: CSSProperties = {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    minHeight: '100%',
    minWidth: '100%',
};

const WRAPPER_STYLES: CSSProperties = {
    overflow: 'hidden',
    position: 'relative',
};

type Sizes = {
    imgWidth?: number;
    imgHeight?: number;
    containerWidth?: number;
    containerHeight?: number;
    aspectRatio?: AspectRatio;
};

function calculateSizes(img: HTMLImageElement | null | undefined, aspectRatio?: AspectRatio): Sizes | undefined {
    if (!aspectRatio || aspectRatio === AspectRatio.original) return undefined;
    const { naturalWidth: imgWidth, naturalHeight: imgHeight } = img || { naturalWidth: 0, naturalHeight: 0 };
    const { width: containerWidth, height: containerHeight } = img?.parentElement?.getBoundingClientRect() || {
        width: 0,
        height: 0,
    };
    return { imgWidth, imgHeight, containerWidth, containerHeight, aspectRatio };
}

const parseFocusPoint = (point: FocusPoint = {}): Required<FocusPoint> => {
    return { x: point.x ? clamp(point.x, -1, 1) : 0, y: point.y ? clamp(point.y, -1, 1) : 0 };
};

function calculateImageShift(
    containerToImageSizeRatio: number,
    containerSize: number,
    imageSize: number,
    focusSize: number,
    toMinus?: boolean,
) {
    const containerCenter = Math.floor(containerSize / 2); // Container center in px
    const focusFactor = (focusSize + 1) / 2; // Focus point of resize image in px
    const scaledImage = Math.floor(imageSize / containerToImageSizeRatio); // Can't use width() as images may be display:none
    let focus = Math.floor(focusFactor * scaledImage);
    if (toMinus) {
        focus = scaledImage - focus;
    }
    let focusOffset = focus - containerCenter; // Calculate difference between focus point and center
    const remainder = scaledImage - focus; // Reduce offset if necessary so image remains filled
    const containerRemainder = containerSize - containerCenter;
    if (remainder < containerRemainder) {
        focusOffset -= containerRemainder - remainder;
    }
    if (focusOffset < 0) {
        focusOffset = 0;
    }
    return (focusOffset * -100) / containerSize;
}

type Styles = { wrapper: CSSProperties; image: CSSProperties };

function calculateImageStyle(sizes: Sizes, point: Required<FocusPoint>): Styles | undefined {
    if (!sizes.imgWidth || !sizes.imgHeight || !sizes.containerWidth || !sizes.containerHeight) {
        return undefined;
    }

    // Which is over by more?
    const widthRatio = sizes.imgWidth / sizes.containerWidth;
    const heightRatio = sizes.imgHeight / sizes.containerHeight;

    const image: CSSProperties = { ...IMG_STYLES };

    // Minimize image while still filling space
    if (sizes.imgWidth > sizes.containerWidth && sizes.imgHeight > sizes.containerHeight) {
        image[widthRatio > heightRatio ? 'maxHeight' : 'maxWidth'] = '100%';
    }

    if (widthRatio > heightRatio) {
        image.left = `${calculateImageShift(heightRatio, sizes.containerWidth, sizes.imgWidth, point.x)}%`;
    } else if (widthRatio < heightRatio) {
        image.top = `${calculateImageShift(widthRatio, sizes.containerHeight, sizes.imgHeight, point.y, true)}%`;
    }

    return {
        image,
        wrapper: WRAPPER_STYLES,
    };
}

/**
 * Hook that calculate CSS style to shift the image in it's container according to the focus point.
 */
export const useFocusPoint = (options: {
    focusPoint?: FocusPoint;
    aspectRatio?: AspectRatio;
    imgRef: RefObject<HTMLImageElement>;
    loadingState: LoadingState;
    fillHeight?: boolean;
}): Styles | undefined => {
    const { aspectRatio, focusPoint, imgRef, loadingState, fillHeight } = options;

    const point = parseFocusPoint(focusPoint);

    const previousPoint = useRef<Required<FocusPoint>>();
    const previousSizes = useRef<Sizes>({});
    const [style, setStyle] = useState<Styles>();

    // Update style.
    const update = useMemo(
        () => () => {
            const sizes = calculateSizes(imgRef?.current, aspectRatio);
            if (!sizes || (isEqual(sizes, previousSizes.current) && isEqual(point, previousPoint.current))) {
                // Nothing changed.
                return;
            }
            setStyle(calculateImageStyle(sizes, point));
            previousPoint.current = point;
            previousSizes.current = sizes;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...Object.values(point), imgRef, aspectRatio, fillHeight],
    );

    // Update on image loaded.
    useLayoutEffect(update, [update, loadingState]);

    // Update on parent resize.
    const updateRef = useRef<Callback>(null);
    useLayoutEffect(() => {
        (updateRef as MutableRefObject<Callback>).current = update;
    }, [update]);
    useOnResize(imgRef?.current?.parentElement, updateRef);

    return style;
};