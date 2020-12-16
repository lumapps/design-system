import { IMAGES, imageKnob } from '@lumx/react/stories/knobs';
import React from 'react';

import { AspectRatio, ImageBlock, Slideshow, SlideshowControls, SlideshowItem } from '@lumx/react';

export default { title: 'LumX components/slideshow/Slideshow controls' };

export const Simple = () => {
    const parentRef = React.useRef(null);
    const slidesCount = 9;
    const [activeIndex, setActiveIndex] = React.useState(0);
    const maxIndex = slidesCount - 1;

    const onNextClick = () => setActiveIndex(activeIndex === maxIndex ? 0 : activeIndex + 1);
    const onPreviousClick = () => setActiveIndex(activeIndex === 0 ? maxIndex : activeIndex - 1);
    const onPaginationClick = (index: number) => setActiveIndex(index);

    return (
        <SlideshowControls
            activeIndex={activeIndex}
            slidesCount={slidesCount}
            parentRef={parentRef}
            onNextClick={onNextClick}
            onPreviousClick={onPreviousClick}
            onPaginationClick={onPaginationClick}
            nextButtonProps={{ label: 'Next' }}
            previousButtonProps={{ label: 'Previous' }}
        />
    );
};

export const ControllingSlideshow = ({ theme }: any) => {
    const parentRef = React.useRef(null);
    const items = [
        imageKnob('Image 1', IMAGES.landscape1),
        imageKnob('Image 2', IMAGES.landscape2),
        imageKnob('Image 3', IMAGES.landscape3),
        imageKnob('Image 5', IMAGES.portrait1),
        imageKnob('Image 6', IMAGES.portrait2),
        imageKnob('Image 7', IMAGES.portrait3),
    ];
    const [activeIndex, setActiveIndex] = React.useState(0);
    const maxIndex = items.length - 1;
    const slideshowStyle = {
        width: '50%',
    };

    const onNextClick = () => setActiveIndex(activeIndex === maxIndex ? 0 : activeIndex + 1);
    const onPreviousClick = () => setActiveIndex(activeIndex === 0 ? maxIndex : activeIndex - 1);
    const onPaginationClick = (index: number) => setActiveIndex(index);

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
                {items.map((item) => (
                    <SlideshowItem key={item}>
                        <ImageBlock image={item} thumbnailProps={{ aspectRatio: AspectRatio.vertical }} theme={theme} />
                    </SlideshowItem>
                ))}
            </Slideshow>
            <div style={{ position: 'absolute', bottom: 0, right: -24 }}>
                <SlideshowControls
                    activeIndex={activeIndex}
                    slidesCount={items.length}
                    parentRef={parentRef}
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
