import { ImageLightbox, Mosaic } from '@lumx/react';

const IMAGES = [
    { image: 'https://picsum.photos/id/256/800/546', alt: 'Landscape 1' },
    { image: 'https://picsum.photos/id/535/640/480', alt: 'Landscape 2' },
    { image: 'https://picsum.photos/id/24/640/480', alt: 'Landscape 3' },
    { image: 'https://picsum.photos/id/653/275/500', alt: 'Portrait 1' },
    { image: 'https://picsum.photos/id/670/350/500', alt: 'Portrait 2' },
    { image: 'https://picsum.photos/id/885/300/500', alt: 'Portrait 3' },
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
