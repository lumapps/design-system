import React from 'react';
import range from 'lodash/range';
import { AspectRatio, Button, FlexBox, ImageBlock, Slideshow, SlideshowItem, Orientation } from '@lumx/react';
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
            aria-label="Simple carousel example"
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
                <SlideshowItem key={`${image}-${index}`} aria-label={`${index + 1} of ${images.length}`}>
                    <ImageBlock
                        thumbnailProps={{ aspectRatio: AspectRatio.horizontal, loading: 'eager' }}
                        image={image}
                        alt={alt}
                        theme={theme}
                    />
                </SlideshowItem>
            ))}
        </Slideshow>
    );
};

export const SimpleWithAutoPlay = ({ theme }: any) => {
    const images = thumbnailsKnob(6);
    const activeIndex = number('Active index', 0);
    const groupBy = number('Group by', 1);
    const interval = number('Autoplay interval (in milliseconds)', 1000);

    return (
        <Slideshow
            aria-label="Simple with autoplay example"
            activeIndex={activeIndex}
            autoPlay
            interval={interval}
            slideshowControlsProps={{
                nextButtonProps: { label: 'Next' },
                previousButtonProps: { label: 'Previous' },
                playButtonProps: { label: 'Play/Pause' },
            }}
            theme={theme}
            groupBy={groupBy}
            style={{ width: '50%' }}
        >
            {images.map(({ image, alt }, index) => (
                <SlideshowItem key={`${image}-${index}`} aria-label={`${index + 1} of ${images.length}`}>
                    <ImageBlock
                        thumbnailProps={{ aspectRatio: AspectRatio.horizontal, loading: 'eager' }}
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
    const slides = range(5);
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
                    aria-label="Responsive SlideShow Swipe"
                    activeIndex={0}
                    slideshowControlsProps={{
                        nextButtonProps: { label: 'Next' },
                        previousButtonProps: { label: 'Previous' },
                    }}
                >
                    {slides.map((slide, key) => (
                        <SlideshowItem key={`${slide}`} aria-label={`${key + 1} of ${slides.length}`}>
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

const slides = [
    {
        src: 'https://www.w3.org/WAI/ARIA/apg/example-index/carousel/images/foyleswarslide__800x600.jpg',
        alt: 'A man in a suit and fedora and a woman with coiffed hair look sternly into the camera.',
        title: 'Foyle’s War Revisited',
        subtitle: '8 pm Sunday, March 8, on TV: Sneak peek at the final season',
        link: '#',
    },
    {
        src: 'https://www.w3.org/WAI/ARIA/apg/example-index/carousel/images/britcomdavidslide__800x600.jpg',
        alt: 'British flag with WILL-TV host David Thiel.',
        title: 'Great Britain Vote: 7 pm Sat.',
        link: '#',
    },
    {
        src: 'https://www.w3.org/WAI/ARIA/apg/example-index/carousel/images/mag800-2__800x600.jpg',
        alt: 'Mid-American Gardener panelists on the set.',
        title: 'Mid-American Gardener: Thursdays at 7 pm',
        subtitle: 'Watch the latest episode',
        link: '#',
    },
];
export const WithComplexContent = () => (
    <Slideshow
        aria-label="Carousel with complex content"
        activeIndex={0}
        groupBy={2}
        slideshowControlsProps={{
            nextButtonProps: { label: 'Next' },
            previousButtonProps: { label: 'Previous' },
        }}
        autoPlay
    >
        {slides.map((slide, key) => (
            <SlideshowItem aria-label={`${key + 1} of ${slides.length}`} key={slide.src}>
                <a href={slide.link}>
                    <img src={slide.src} alt={slide.alt} />
                </a>
                <FlexBox orientation={Orientation.vertical}>
                    <h3>
                        <a href={slide.link}>{slide.title}</a>
                        {/* Add a non focusable element to test that it stays that way after a page change. */}
                        <button type="button" tabIndex={-1} aria-hidden="true">
                            Not focusable
                        </button>
                    </h3>
                    {slide.subtitle && <p>{slide.subtitle}</p>}
                </FlexBox>
            </SlideshowItem>
        ))}
    </Slideshow>
);
