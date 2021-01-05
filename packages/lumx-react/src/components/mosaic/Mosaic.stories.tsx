import React, { useCallback, useRef, useState } from 'react';

import { Alignment, ImageBlock, Lightbox, Slideshow, SlideshowItem, Theme } from '@lumx/react';
import { boolean, number } from '@storybook/addon-knobs';
import { thumbnailsKnob } from '@lumx/react/stories/knobs/thumbnailsKnob';
import { Mosaic } from './Mosaic';

export default { title: 'LumX components/mosaic/Mosaic' };

export const OneThumbnail = ({ theme }: any) => (
    <div style={{ width: 250 }}>
        <Mosaic theme={theme} thumbnails={thumbnailsKnob(1)} />
    </div>
);

export const TwoThumbnails = ({ theme }: any) => (
    <div style={{ width: 250 }}>
        <Mosaic theme={theme} thumbnails={thumbnailsKnob(2)} />
    </div>
);

export const ThreeThumbnails = ({ theme }: any) => (
    <div style={{ width: 250 }}>
        <Mosaic theme={theme} thumbnails={thumbnailsKnob(3)} />
    </div>
);

export const FourThumbnails = ({ theme }: any) => (
    <div style={{ width: 250 }}>
        <Mosaic theme={theme} thumbnails={thumbnailsKnob(4)} />
    </div>
);

export const FiveThumbnails = ({ theme }: any) => (
    <div style={{ width: 250 }}>
        <Mosaic theme={theme} thumbnails={thumbnailsKnob(5)} />
    </div>
);

export const SixThumbnails = ({ theme }: any) => {
    const enableSlideShow = boolean('Enable slideshow', true);
    const thumbnails = thumbnailsKnob(number('Number of thumbnails', 6, { min: 1, max: 6 }));
    const [activeIndex, setActiveIndex] = useState<number>();
    const lightBoxParent = useRef(null);
    const closeLightBox = useCallback(() => {
        setActiveIndex(undefined);
    }, [setActiveIndex]);

    return (
        <div ref={lightBoxParent} style={{ width: 250 }}>
            <Mosaic theme={theme} onImageClick={enableSlideShow ? setActiveIndex : undefined} thumbnails={thumbnails} />

            {enableSlideShow && (
                <Lightbox
                    isOpen={activeIndex !== undefined}
                    parentElement={lightBoxParent}
                    onClose={closeLightBox}
                    closeButtonProps={{ label: 'Close' }}
                >
                    <Slideshow
                        activeIndex={activeIndex}
                        slideshowControlsProps={{
                            nextButtonProps: { label: 'Next' },
                            previousButtonProps: { label: 'Previous' },
                        }}
                        fillHeight
                        theme={Theme.dark}
                    >
                        {thumbnails.map((thumbnail, index) => (
                            <SlideshowItem key={`${thumbnail.alt}-${thumbnail.image}-${index}`}>
                                <ImageBlock
                                    alt={thumbnail.alt}
                                    image={thumbnail.image}
                                    theme={Theme.dark}
                                    align={Alignment.center}
                                    fillHeight
                                />
                            </SlideshowItem>
                        ))}
                    </Slideshow>
                </Lightbox>
            )}
        </div>
    );
};
