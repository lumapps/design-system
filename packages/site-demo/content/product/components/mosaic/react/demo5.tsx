import { ImageLightbox, Mosaic } from '@lumx/react';

const IMAGES = [
    { image: '/demo-assets/landscape1.jpg', alt: 'Landscape 1' },
    { image: '/demo-assets/landscape2.jpg', alt: 'Landscape 2' },
    { image: '/demo-assets/landscape3.jpg', alt: 'Landscape 3' },
    { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
    { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
    { image: '/demo-assets/portrait3.jpg', alt: 'Portrait 3' },
];

export default () => {
    const { getTriggerProps, imageLightboxProps } = ImageLightbox.useImageLightbox({ images: IMAGES });
    const thumbnails = IMAGES.map((image, index) => ({
        ...image,
        ...getTriggerProps({ activeImageIndex: index }),
        alt: `${image.alt}; Open in a fullscreen image slideshow`,
    }));
    return (
        <div style={{ width: 250 }}>
            <Mosaic thumbnails={thumbnails} />

            <ImageLightbox
                {...imageLightboxProps}
                aria-label="Fullscreen image slideshow"
                closeButtonProps={{ label: 'Close' }}
                zoomInButtonProps={{ label: 'Zoom in' }}
                zoomOutButtonProps={{ label: 'Zoom out' }}
                slideshowControlsProps={{
                    nextButtonProps: { label: 'Next image' },
                    previousButtonProps: { label: 'Previous image' },
                    paginationItemProps: (index) => ({ label: `Go to slide ${index + 1}` }),
                }}
            />
        </div>
    );
};
