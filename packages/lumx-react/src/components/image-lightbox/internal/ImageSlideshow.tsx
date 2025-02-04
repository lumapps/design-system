import React from 'react';

import { mdiMagnifyMinusOutline, mdiMagnifyPlusOutline } from '@lumx/icons';
import { FlexBox, IconButton, Slides, SlideshowControls } from '@lumx/react';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';

import memoize from 'lodash/memoize';
import { ImageCaption } from '../../image-block/ImageCaption';
import { CLASSNAME } from '../constants';
import type { ImagesProps, InheritedSlideShowProps, ZoomButtonProps } from '../types';
import { ImageSlide } from './ImageSlide';

export interface ImageSlideshowProps extends InheritedSlideShowProps, ZoomButtonProps, ImagesProps {
    currentPaginationItemRef?: React.Ref<HTMLButtonElement>;
    footerRef?: React.Ref<HTMLDivElement>;
}

/** Internal image slideshow component for ImageLightbox */
export const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
    activeImageIndex,
    images,
    slideGroupLabel,
    zoomInButtonProps,
    zoomOutButtonProps,
    slideshowControlsProps,
    currentPaginationItemRef,
    footerRef,
    activeImageRef,
}) => {
    const {
        activeIndex,
        slideshowId,
        setSlideshow,
        slideshowSlidesId,
        slidesCount,
        onNextClick,
        onPaginationClick,
        onPreviousClick,
        toggleAutoPlay,
    } = SlideshowControls.useSlideshowControls({
        itemsCount: images.length,
        activeIndex: activeImageIndex,
    });

    // Image metadata (caption)
    const title = images[activeIndex]?.title;
    const description = images[activeIndex]?.description;
    const tags = images[activeIndex]?.tags;
    const metadata =
        title || description || tags ? (
            <ImageCaption theme="dark" as="div" title={title} description={description} tags={tags} align="center" />
        ) : null;

    // Slideshow controls
    const slideShowControls =
        slidesCount > 1 && slideshowControlsProps ? (
            <SlideshowControls
                theme="dark"
                activeIndex={activeIndex}
                slidesCount={slidesCount}
                onNextClick={onNextClick}
                onPreviousClick={onPreviousClick}
                onPaginationClick={onPaginationClick}
                {...slideshowControlsProps}
                paginationItemProps={(index: number) => {
                    const props = slideshowControlsProps?.paginationItemProps?.(index) || {};
                    return {
                        ...props,
                        ref: mergeRefs(
                            (props as any)?.ref,
                            // Focus the active pagination item once on mount
                            activeIndex === index ? currentPaginationItemRef : undefined,
                        ),
                    };
                }}
            />
        ) : null;

    // Zoom controls
    const [scale, setScale] = React.useState<number | undefined>(undefined);
    const zoomEnabled = zoomInButtonProps && zoomOutButtonProps;
    const onScaleChange = React.useMemo(() => {
        if (!zoomEnabled) return undefined;
        return (newScale: number) => {
            setScale((prevScale = 1) => Math.max(1, newScale * prevScale));
        };
    }, [zoomEnabled]);
    const zoomIn = React.useCallback(() => onScaleChange?.(1.5), [onScaleChange]);
    const zoomOut = React.useCallback(() => onScaleChange?.(0.5), [onScaleChange]);
    React.useEffect(() => {
        // Reset scale on slide change
        if (typeof activeIndex === 'number') setScale(undefined);
    }, [activeIndex]);
    const zoomControls = zoomEnabled && (
        <>
            <IconButton
                {...zoomInButtonProps}
                theme="dark"
                emphasis="low"
                icon={mdiMagnifyPlusOutline}
                onClick={zoomIn}
            />
            <IconButton
                {...zoomOutButtonProps}
                theme="dark"
                emphasis="low"
                isDisabled={!scale || scale <= 1}
                icon={mdiMagnifyMinusOutline}
                onClick={zoomOut}
            />
        </>
    );

    const getImgRef = React.useMemo(
        () =>
            memoize(
                (index: number, isActive: boolean) => {
                    return mergeRefs(images?.[index].imgRef, isActive ? activeImageRef : undefined);
                },
                // memoize based on both arguments
                (...args) => args.join(),
            ),
        [images, activeImageRef],
    );

    return (
        <>
            <Slides
                activeIndex={activeIndex}
                theme="dark"
                slideGroupLabel={slideGroupLabel}
                fillHeight
                id={slideshowId}
                ref={setSlideshow}
                slidesId={slideshowSlidesId}
                toggleAutoPlay={toggleAutoPlay}
            >
                {images.map(({ image, imgRef, ...imageProps }, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <ImageSlide
                            isActive={isActive}
                            key={image}
                            image={{
                                ...imageProps,
                                image,
                                imgRef: getImgRef(index, isActive),
                            }}
                            scale={isActive ? scale : undefined}
                            onScaleChange={onScaleChange}
                        />
                    );
                })}
            </Slides>
            {(metadata || slideShowControls || zoomControls) && (
                <FlexBox
                    ref={footerRef}
                    className={`${CLASSNAME}__footer`}
                    orientation="vertical"
                    vAlign="center"
                    gap="big"
                >
                    {metadata}

                    <FlexBox className={`${CLASSNAME}__footer-actions`} orientation="horizontal" gap="regular">
                        {slideShowControls}
                        {zoomControls}
                    </FlexBox>
                </FlexBox>
            )}
        </>
    );
};
