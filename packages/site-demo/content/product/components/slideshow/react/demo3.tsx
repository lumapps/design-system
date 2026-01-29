import { ImageBlock, Slideshow, SlideshowItem, type Theme } from '@lumx/react';

const IMAGES = [
    { image: '/demo-assets/landscape1.jpg', alt: 'Landscape 1' },
    { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
    { image: '/demo-assets/landscape2.jpg', alt: 'Landscape 2' },
    { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
    { image: '/demo-assets/landscape3.jpg', alt: 'Landscape 3' },
    { image: '/demo-assets/portrait3.jpg', alt: 'Portrait 3' },
];

export default ({ theme }: { theme?: Theme }) => (
    <Slideshow
        activeIndex={0}
        slideshowControlsProps={{
            nextButtonProps: { label: 'Next' },
            previousButtonProps: { label: 'Previous' },
        }}
        theme={theme}
        autoPlay
        groupBy={1}
        style={{ width: '50%' }}
    >
        {IMAGES.map(({ image, alt }) => (
            <SlideshowItem key={image}>
                <ImageBlock thumbnailProps={{ aspectRatio: 'vertical' }} image={image} alt={alt} theme={theme} />
            </SlideshowItem>
        ))}
    </Slideshow>
);
