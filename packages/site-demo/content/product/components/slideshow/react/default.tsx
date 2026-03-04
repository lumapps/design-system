import { Chip, ChipGroup, ImageBlock, Slideshow, SlideshowItem, type Theme } from '@lumx/react';

const IMAGES = [
    { image: 'https://picsum.photos/id/256/800/546', alt: 'Landscape 1' },
    { image: 'https://picsum.photos/id/653/275/500', alt: 'Portrait 1' },
    { image: 'https://picsum.photos/id/535/640/480', alt: 'Landscape 2' },
    { image: 'https://picsum.photos/id/670/350/500', alt: 'Portrait 2' },
    { image: 'https://picsum.photos/id/24/640/480', alt: 'Landscape 3' },
    { image: 'https://picsum.photos/id/885/300/500', alt: 'Portrait 3' },
];

export default ({ theme }: { theme?: Theme }) => (
    <Slideshow
        activeIndex={0}
        slideshowControlsProps={{
            nextButtonProps: { label: 'Next' },
            previousButtonProps: { label: 'Previous' },
        }}
        theme={theme}
        groupBy={1}
        style={{ width: '50%' }}
    >
        {IMAGES.map(({ image, alt }) => (
            <SlideshowItem key={image}>
                <ImageBlock
                    captionPosition="over"
                    image={image}
                    alt={alt}
                    theme={theme}
                    thumbnailProps={{ aspectRatio: 'horizontal' }}
                    title="Nice image"
                    description="What an image"
                    chips={
                        <ChipGroup align="left">
                            <Chip size="s" theme={theme}>
                                Tag 1
                            </Chip>
                            <Chip size="s" theme={theme}>
                                Tag 2
                            </Chip>
                        </ChipGroup>
                    }
                />
            </SlideshowItem>
        ))}
    </Slideshow>
);
