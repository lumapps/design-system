import { AspectRatio, ImageBlock, Slideshow, SlideshowItem, SlideshowProps } from '@lumx/react';
import { boolean, number } from '@storybook/addon-knobs';
import React from 'react';
import { thumbnailsKnob } from '@lumx/react/stories/knobs/thumbnailsKnob';

export default { title: 'LumX components/slideshow/Slideshow' };

export const Simple = ({ theme }: any) => {
    const images = thumbnailsKnob(6);
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
            {images.map(({ image, alt }, index) => (
                <SlideshowItem key={`${image}-${index}`}>
                    <ImageBlock
                        thumbnailProps={{ aspectRatio: AspectRatio.horizontal }}
                        image={image}
                        alt={alt}
                        theme={theme}
                    />
                </SlideshowItem>
            ))}
        </Slideshow>
    );
};
