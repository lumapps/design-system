import range from 'lodash/range';
import { AspectRatio, FlexBox, ImageBlock, Slideshow, SlideshowItem, Orientation } from '@lumx/react';
import { IMAGES, LANDSCAPE_IMAGES } from '@lumx/core/stories/controls/image';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { SlideMode } from './constants';

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
        slideMode: getSelectArgType(SlideMode, 'inline-radio'),
    },
};

/** Simple image slideshow */
export const Images = ({ images = Object.values(LANDSCAPE_IMAGES), ...props }: any) => {
    return (
        <Slideshow
            aria-label="Simple carousel example"
            slideshowControlsProps={{
                nextButtonProps: { label: 'Next' },
                previousButtonProps: { label: 'Previous' },
                playButtonProps: { label: 'Play/Pause' },
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

/** Slideshow scroll-snap mode */
export const ImagesWithScrollSnap = {
    render: Images,
    args: { slideMode: SlideMode.scrollSnap },
};

/** Slideshow autoplay */
export const ImagesWithAutoPlay = {
    render: Images,
    args: { autoPlay: true },
};

/** Complex content slideshow */
export const ComplexContent = {
    render: ({ slideCount, ...props }: any, { parameters: { slides } }: any) => (
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
    ),
    args: {
        groupBy: 2,
        slideCount: 6,
    },
    parameters: {
        slides: [
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
        ],
    },
};
