import React from 'react';

import { SlideshowItem, Thumbnail } from '@lumx/react';
import { useMergeRefs } from '@lumx/react/utils/mergeRefs';
import { useSizeOnWindowResize } from '@lumx/react/hooks/useSizeOnWindowResize';
import { useImageSize } from '@lumx/react/hooks/useImageSize';
import { isReducedMotion } from '@lumx/react/utils/browser/isReducedMotion';
import { isEqual } from '@lumx/react/utils/object/isEqual';

import { CLASSNAME } from '../constants';
import { usePointerZoom } from './usePointerZoom';
import { useAnimateScroll } from './useAnimateScroll';
import type { ImageProps } from '../types';

export interface ImageSlideProps {
    image: ImageProps;
    isActive?: boolean;
    scale?: number;
    onScaleChange?: (value: number) => void;
}

/** Internal image slide component for ImageLightbox */
export const ImageSlide = React.memo((props: ImageSlideProps) => {
    const {
        isActive,
        scale,
        onScaleChange,
        image: { image, imgRef: propImgRef, imgProps, alt, loadingPlaceholderImageRef },
    } = props;

    // Get scroll area size
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const [scrollAreaSize, updateSize] = useSizeOnWindowResize(scrollAreaRef);
    React.useEffect(() => {
        // Update size when active
        if (isActive) updateSize();
    }, [isActive, updateSize]);

    // Get image size
    const imgRef = React.useRef<HTMLImageElement>(null);
    const imageSize = useImageSize(imgRef, () => {
        const width = Number.parseInt(imgProps?.width as any, 10);
        const height = Number.parseInt(imgProps?.height as any, 10);
        return width && height ? { width, height } : null;
    });

    // Calculate new image size with scale
    const scaledImageSize = React.useMemo(() => {
        if (!scrollAreaSize || !imageSize) {
            return null;
        }
        const horizontalScale = scrollAreaSize.width / imageSize.width;
        const verticalScale = scrollAreaSize.height / imageSize.height;
        const baseScale = Math.min(1, Math.min(horizontalScale, verticalScale));
        return {
            width: imageSize.width * baseScale * (scale ?? 1),
            height: imageSize.height * baseScale * (scale ?? 1),
        };
    }, [scrollAreaSize, imageSize, scale]);

    // Animate scroll to preserve the center of the current visible window in the scroll area
    const animateScroll = useAnimateScroll(scrollAreaRef);

    // Zoom via mouse wheel or multi-touch pinch zoom
    const isPointerZooming = usePointerZoom(scrollAreaRef, onScaleChange, animateScroll);

    // Animate scroll on scale change
    React.useLayoutEffect(() => {
        if (scale && !isPointerZooming) {
            animateScroll();
        }
    }, [isPointerZooming, scale, animateScroll]);

    const isScrollable =
        scaledImageSize &&
        scrollAreaSize &&
        (scaledImageSize.width > scrollAreaSize.width || scaledImageSize.height > scrollAreaSize.height);

    return (
        <SlideshowItem
            ref={scrollAreaRef}
            // Make it accessible to keyboard nav when the zone is scrollable
            tabIndex={isScrollable ? 0 : undefined}
            className={`${CLASSNAME}__image-slide`}
        >
            <Thumbnail
                imgRef={useMergeRefs(imgRef, propImgRef)}
                image={image}
                alt={alt}
                className={`${CLASSNAME}__thumbnail`}
                imgProps={{
                    ...imgProps,
                    style: {
                        ...imgProps?.style,
                        ...(scaledImageSize || {
                            maxHeight: scrollAreaSize?.height,
                            maxWidth: scrollAreaSize?.width,
                        }),
                        // Only animate when scale is set, and we are not pointer zooming and the user does not prefer reduced motion
                        transition: scale && !isPointerZooming && !isReducedMotion() ? 'all 250ms' : undefined,
                    },
                }}
                loadingPlaceholderImageRef={loadingPlaceholderImageRef}
            />
        </SlideshowItem>
    );
}, isEqual);
