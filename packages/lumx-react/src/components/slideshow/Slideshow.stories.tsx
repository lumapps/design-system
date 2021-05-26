import React from 'react';
import range from 'lodash/range';
import { AspectRatio, Button, FlexBox, ImageBlock, Slideshow, SlideshowItem } from '@lumx/react';
import { boolean, number } from '@storybook/addon-knobs';
import { thumbnailsKnob } from '@lumx/react/stories/knobs/thumbnailsKnob';

export default { title: 'LumX components/slideshow/Slideshow' };

export const Simple = ({ theme }: any) => {
    const images = thumbnailsKnob(6);
    const activeIndex = number('Active index', 0);
    const groupBy = number('Group by', 1);
    const autoPlay = boolean('Autoplay', false);
    const interval = number('Autoplay interval (in milliseconds)', 1000);

    return (
        <Slideshow
            activeIndex={activeIndex}
            autoPlay={autoPlay}
            interval={interval}
            slideshowControlsProps={{
                nextButtonProps: { label: 'Next' },
                previousButtonProps: { label: 'Previous' },
            }}
            theme={theme}
            groupBy={groupBy}
            style={{ width: '50%' }}
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

export const ResponsiveSlideShowSwipe = () => {
    const slides = range(3);
    return (
        <>
            In responsive mode
            <ul>
                <li>The slideshow is swipe-able (horizontal left/right)</li>
                <li>The vertical scroll should still be possible</li>
                <li>Clicking on elements inside a slide should work correctly</li>
            </ul>
            <FlexBox vAlign="center">
                <Slideshow
                    slideshowControlsProps={{
                        nextButtonProps: { label: 'Next' },
                        previousButtonProps: { label: 'Previous' },
                    }}
                >
                    {slides.map((slide) => (
                        <SlideshowItem key={`${slide}`}>
                            <FlexBox
                                style={{ border: '1px solid grey', maxWidth: 300, height: 300 }}
                                hAlign="center"
                                vAlign="center"
                            >
                                <Button onClick={() => alert(`Clicked button ${slide}`)}>Button {slide}</Button>
                            </FlexBox>
                        </SlideshowItem>
                    ))}
                </Slideshow>
            </FlexBox>
            {
                /* Line padding to test the vertical scroll.*/
                range(100).map((i) => (
                    <br key={i} />
                ))
            }
        </>
    );
};
