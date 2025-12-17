import {
    AspectRatio,
    ImageBlock,
    ImageBlockCaptionPosition,
    Slideshow,
    SlideshowItem,
    ThumbnailProps,
} from '@lumx/react';

const IMAGES: ThumbnailProps[] = [
    { image: '/demo-assets/landscape1.jpg', alt: 'Landscape 1' },
    { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
    { image: '/demo-assets/landscape2.jpg', alt: 'Landscape 2' },
    { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
    { image: '/demo-assets/landscape3.jpg', alt: 'Landscape 3' },
    { image: '/demo-assets/portrait3.jpg', alt: 'Portrait 3' },
];

export const App = ({ theme }: any) => {
    const imageBlockDemoProps = {
        description: 'What an image',
        title: 'Nice Image',
    };

    return (
        <Slideshow
            activeIndex={0}
            slideshowControlsProps={{
                nextButtonProps: { label: 'Next' },
                previousButtonProps: { label: 'Previous' },
            }}
            theme={theme}
            autoPlay
            groupBy={2}
            style={{ width: '100%' }}
        >
            {IMAGES.map(({ image, alt }) => (
                <SlideshowItem key={image}>
                    <ImageBlock
                        captionPosition={ImageBlockCaptionPosition.over}
                        image={image}
                        alt={alt}
                        theme={theme}
                        thumbnailProps={{ aspectRatio: AspectRatio.horizontal }}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>
            ))}
        </Slideshow>
    );
};
