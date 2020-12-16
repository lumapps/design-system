import { AspectRatio, ImageBlock, Slideshow, SlideshowItem, SlideshowProps } from '@lumx/react';
import { IMAGES, imageKnob } from '@lumx/react/stories/knobs';
import { boolean, number } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/slideshow/Slideshow' };

export const Simple = ({ theme }: any) => {
    const images = [
        imageKnob('Image 1', IMAGES.landscape1),
        imageKnob('Image 2', IMAGES.landscape2),
        imageKnob('Image 3', IMAGES.landscape3),
        imageKnob('Image 5', IMAGES.portrait1),
        imageKnob('Image 6', IMAGES.portrait2),
        imageKnob('Image 7', IMAGES.portrait3),
    ];
    const activeIndex = number('Active index', 0);
    const groupBy = number('Group by', 1);
    const autoPlay = boolean('Autoplay', false);
    const interval = number('Autoplay interval (in milliseconds)', 1000);

    const slideshowControlsProps: SlideshowProps['slideshowControlsProps'] = {
        nextButtonProps: { label: 'Next' },
        previousButtonProps: { label: 'Previous' },
    };
    return (
        <Slideshow
            activeIndex={activeIndex}
            autoPlay={autoPlay}
            interval={interval}
            slideshowControlsProps={slideshowControlsProps}
            theme={theme}
            groupBy={groupBy}
            style={{ width: '50%' }}
            nextButtonProps={{ label: 'Next' }}
            previousButtonProps={{ label: 'Previous' }}
        >
            {images.map((image, index) => (
                <SlideshowItem key={`${image}-${index}`}>
                    <ImageBlock thumbnailProps={{ aspectRatio: AspectRatio.horizontal }} image={image} theme={theme} />
                </SlideshowItem>
            ))}
        </Slideshow>
    );
};
