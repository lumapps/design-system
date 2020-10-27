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
        />
    );
};

export const ControllingSlideshow = ({ theme }: any) => {
    const parentRef = React.useRef(null);
    const items = [
        'https://picsum.photos/480/400/?image=1',
        'https://picsum.photos/480/400/?image=2',
        'https://picsum.photos/480/400/?image=3',
        'https://picsum.photos/480/400/?image=4',
        'https://picsum.photos/480/400/?image=5',
        'https://picsum.photos/480/400/?image=6',
        'https://picsum.photos/480/400/?image=7',
        'https://picsum.photos/480/400/?image=8',
        'https://picsum.photos/480/400/?image=9',
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
                hasControls={false}
                theme={theme}
                autoPlay={true}
                groupBy={1}
                style={slideshowStyle}
                onChange={setActiveIndex}
            >
                {items.map((item) => (
                    <SlideshowItem key={item}>
                        <ImageBlock aspectRatio={AspectRatio.vertical} image={item} theme={theme} />
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
                />
            </div>
        </div>
    );
};
