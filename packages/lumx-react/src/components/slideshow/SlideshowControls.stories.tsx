import React from 'react';

import { AspectRatio, ImageBlock, Slideshow, SlideshowControls, SlideshowItem } from '@lumx/react';
import { thumbnailsKnob } from '@lumx/react/stories/knobs/thumbnailsKnob';

export default { title: 'LumX components/slideshow/Slideshow controls' };

export const Simple = () => {
    const {
        activeIndex,
        slidesCount,
        onNextClick,
        onPreviousClick,
        onPaginationClick,
    } = SlideshowControls.useSlideshowControls({
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
        />
    );
};

export const ControllingSlideshow = ({ theme }: any) => {
    const items = thumbnailsKnob(6);
    const slideshowStyle = {
        width: '50%',
    };

    const {
        activeIndex,
        setActiveIndex,
        onNextClick,
        onPreviousClick,
        onPaginationClick,
    } = SlideshowControls.useSlideshowControls({
        itemsCount: 6,
    });

    return (
        <div style={{ height: 400, width: 500, position: 'relative' }}>
            <Slideshow
                activeIndex={activeIndex}
                theme={theme}
                autoPlay
                groupBy={1}
                style={slideshowStyle}
                onChange={setActiveIndex}
            >
                {items.map(({ image, alt }) => (
                    <SlideshowItem key={image}>
                        <ImageBlock
                            image={image}
                            alt={alt}
                            thumbnailProps={{ aspectRatio: AspectRatio.vertical }}
                            theme={theme}
                        />
                    </SlideshowItem>
                ))}
            </Slideshow>
            <div style={{ position: 'absolute', bottom: 0, right: -24 }}>
                <SlideshowControls
                    activeIndex={activeIndex}
                    slidesCount={items.length}
                    onNextClick={onNextClick}
                    onPreviousClick={onPreviousClick}
                    onPaginationClick={onPaginationClick}
                    nextButtonProps={{ label: 'Next' }}
                    previousButtonProps={{ label: 'Previous' }}
                />
            </div>
        </div>
    );
};
