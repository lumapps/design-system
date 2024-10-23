import React from 'react';

import { AspectRatio, ImageBlock, Slides, SlideshowControls, SlideshowItem } from '@lumx/react';
import { useFocusWithin } from '@lumx/react/hooks/useFocusWithin';
import { LANDSCAPE_IMAGES } from '@lumx/react/stories/controls/image';

export default { title: 'LumX components/slideshow/Slideshow controls' };

export const Simple = () => {
    const { activeIndex, slidesCount, onNextClick, onPreviousClick, onPaginationClick } =
        SlideshowControls.useSlideshowControls({
            itemsCount: 9,
        });

    return (
        <SlideshowControls
            activeIndex={activeIndex}
            slidesCount={slidesCount}
            onNextClick={onNextClick}
            onPreviousClick={onPreviousClick}
            onPaginationClick={onPaginationClick}
            nextButtonProps={{ label: 'Next' }}
            previousButtonProps={{ label: 'Previous' }}
            paginationItemLabel={(index) => `Slide ${index}`}
        />
    );
};

export const ControllingSlideshow = ({ images = Object.values(LANDSCAPE_IMAGES), theme }: any) => {
    const {
        activeIndex: currentIndex,
        slideshowId,
        setSlideshow,
        isAutoPlaying,
        slideshowSlidesId,
        slidesCount,
        onNextClick,
        onPaginationClick,
        onPreviousClick,
        slideshow,
        stopAutoPlay,
        startAutoPlay,
        toggleAutoPlay,
        toggleForcePause,
    } = SlideshowControls.useSlideshowControls({
        activeIndex: 0,
        defaultActiveIndex: 0,
        autoPlay: true,
        itemsCount: 6,
        groupBy: 1,
    });

    useFocusWithin({
        element: slideshow,
        onFocusIn: stopAutoPlay,
        onFocusOut: startAutoPlay,
    });

    return (
        <Slides
            activeIndex={currentIndex}
            id={slideshowId}
            ref={setSlideshow}
            theme={theme}
            isAutoPlaying={isAutoPlaying}
            slidesId={slideshowSlidesId}
            toggleAutoPlay={toggleAutoPlay}
            groupBy={1}
            style={{ width: '50%' }}
            afterSlides={
                <div className={`${Slides.className}__controls`}>
                    <SlideshowControls
                        activeIndex={currentIndex}
                        onPaginationClick={onPaginationClick}
                        onNextClick={onNextClick}
                        onPreviousClick={onPreviousClick}
                        slidesCount={slidesCount}
                        parentRef={slideshow}
                        theme={theme}
                        isAutoPlaying={isAutoPlaying}
                        nextButtonProps={{ label: 'Next' }}
                        previousButtonProps={{ label: 'Previous' }}
                        playButtonProps={{
                            label: 'Play/Pause',
                            onClick: toggleForcePause,
                        }}
                        paginationItemLabel={(index) => `Slide ${index}`}
                    />
                </div>
            }
        >
            {images.map((image: string, index: number) => (
                <SlideshowItem key={`${image}-${index}`}>
                    <ImageBlock
                        thumbnailProps={{ aspectRatio: AspectRatio.horizontal, loading: 'eager' }}
                        image={image}
                        alt=""
                        theme={theme}
                    />
                </SlideshowItem>
            ))}
        </Slides>
    );
};
