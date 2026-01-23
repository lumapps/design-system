import range from 'lodash/range';
import { AspectRatio, Button, FlexBox, ImageBlock, Slideshow, SlideshowItem, Orientation } from '@lumx/react';
import { IMAGES, LANDSCAPE_IMAGES } from '@lumx/core/stories/controls/image';

export default {
    title: 'LumX components/slideshow/Slideshow',
    component: Slideshow,
    args: Slideshow.defaultProps,
    argTypes: {
        activeIndex: { control: 'number' },
        groupBy: { control: 'number' },
        autoPlay: { control: 'boolean' },
        interval: { control: 'number' },
        onClick: { action: true },
    },
};

export const Simple = ({ images = Object.values(LANDSCAPE_IMAGES), ...props }: any) => {
    return (
        <Slideshow
            aria-label="Simple carousel example"
            slideshowControlsProps={{
                nextButtonProps: { label: 'Next' },
                previousButtonProps: { label: 'Previous' },
            }}
            {...props}
            style={{ width: '50%' }}
            slideGroupLabel={(currentGroup, totalGroup) => `${currentGroup} of ${totalGroup}`}
        >
            {images.map((image: string, index: number) => (
                <SlideshowItem key={`${image}-${index}`}>
                    <ImageBlock
                        thumbnailProps={{ aspectRatio: AspectRatio.horizontal, loading: 'eager' }}
                        image={image}
                        alt=""
                    />
                </SlideshowItem>
            ))}
        </Slideshow>
    );
};

export const SimpleWithAutoPlay: any = Simple.bind({});
SimpleWithAutoPlay.args = { autoPlay: true };

export const ResponsiveSlideShowSwipe = ({ onClick }: { onClick: (message: string) => void }) => {
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
                    slideGroupLabel={(currentGroup, totalGroup) => `${currentGroup} of ${totalGroup}`}
                >
                    {slides.map((slide) => (
                        <SlideshowItem key={`${slide}`}>
                            <FlexBox
                                style={{ border: '1px solid grey', maxWidth: 300, height: 300 }}
                                hAlign="center"
                                vAlign="center"
                            >
                                <Button onClick={() => onClick(`Clicked button ${slide}`)}>Button {slide}</Button>
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
        id: 0,
        src: IMAGES.landscape1,
        alt: 'A man in a suit and fedora and a woman with coiffed hair look sternly into the camera.',
        title: 'Foyle’s War Revisited',
        subtitle: '8 pm Sunday, March 8, on TV: Sneak peek at the final season',
        link: '#',
    },
    {
        id: 1,
        src: IMAGES.landscape2,
        alt: 'British flag with WILL-TV host David Thiel.',
        title: 'Great Britain Vote: 7 pm Sat.',
        link: '#',
    },
    {
        id: 2,
        src: IMAGES.landscape3,
        alt: 'Mid-American Gardener panelists on the set.',
        title: 'Mid-American Gardener: Thursdays at 7 pm',
        subtitle: 'Watch the latest episode',
        link: '#',
    },
    {
        id: 3,
        src: IMAGES.portrait1,
        alt: 'A man in a suit and fedora and a woman with coiffed hair look sternly into the camera.',
        title: 'Foyle’s War Revisited',
        subtitle: '8 pm Sunday, March 8, on TV: Sneak peek at the final season',
        link: '#',
    },
    {
        id: 4,
        src: IMAGES.portrait2,
        alt: 'British flag with WILL-TV host David Thiel.',
        title: 'Great Britain Vote: 7 pm Sat.',
        link: '#',
    },
    {
        id: 5,
        src: IMAGES.portrait3,
        alt: 'Mid-American Gardener panelists on the set.',
        title: 'Mid-American Gardener: Thursdays at 7 pm',
        subtitle: 'Watch the latest episode',
        link: '#',
    },
];
export const WithComplexContent = ({ slideCount, ...props }: any) => (
    <Slideshow
        aria-label="Carousel with complex content"
        slideshowControlsProps={{
            nextButtonProps: { label: 'Next' },
            previousButtonProps: { label: 'Previous' },
            playButtonProps: { label: 'Play/Pause' },
            paginationItemProps: (index) => ({ label: `Slide ${index + 1}` }),
        }}
        slideGroupLabel={(currentGroup, totalGroup) => `${currentGroup} of ${totalGroup}`}
        {...props}
    >
        {range(slideCount).map((nb) => {
            const slide = slides[nb % slides.length];

            return (
                <SlideshowItem key={slide.id}>
                    <a href={slide.link}>
                        <ImageBlock
                            thumbnailProps={{ aspectRatio: AspectRatio.horizontal, loading: 'eager' }}
                            image={slide.src}
                            alt={slide.alt}
                        />
                    </a>
                    <FlexBox orientation={Orientation.vertical}>
                        <h3>
                            <a href={slide.link}>{slide.title}</a>
                            {/* Add a non focusable element to test that it stays that way after a page change. */}
                            <button type="button" tabIndex={-1} aria-hidden="true">
                                Not focusable
                            </button>
                            <button type="button">Focusable</button>
                        </h3>
                        {slide.subtitle && <p>{slide.subtitle}</p>}
                    </FlexBox>
                </SlideshowItem>
            );
        })}
    </Slideshow>
);
WithComplexContent.args = {
    groupBy: 2,
    slideCount: 6,
};
