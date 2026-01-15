import { FlexBox, ImageLightbox, Message, Text, Thumbnail } from '@lumx/react';

const images = [
    { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
    { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
    { image: '/demo-assets/landscape3.jpg', alt: 'Landscape 3' },
    { image: '/demo-assets/landscape2.jpg', alt: 'Landscape 2' },
];

export default () => {
    const { getTriggerProps, imageLightboxProps } = ImageLightbox.useImageLightbox({ images });
    return (
        <>
            <FlexBox orientation="vertical" gap="big">
                <FlexBox orientation="horizontal" gap="regular">
                    {images.map(({ image, alt }, index) => (
                        <Thumbnail
                            key={image}
                            image={image}
                            alt={`${alt}; Open in a fullscreen image slideshow`}
                            size="xl"
                            aspectRatio="square"
                            {...getTriggerProps({ activeImageIndex: index })}
                        />
                    ))}
                </FlexBox>

                <Message kind="info" hasBackground>
                    <Text as="span">Click on a picture to open the image lightbox.</Text>
                </Message>
            </FlexBox>

            <ImageLightbox
                {...imageLightboxProps}
                aria-label="Fullscreen image slideshow"
                closeButtonProps={{ label: 'Close' }}
                zoomInButtonProps={{ label: 'Zoom in' }}
                zoomOutButtonProps={{ label: 'Zoom out' }}
                slideshowControlsProps={{
                    nextButtonProps: { label: 'Next' },
                    previousButtonProps: { label: 'Previous' },
                    paginationItemProps: (index) => ({ label: `Go to slide ${index + 1}` }),
                }}
            />
        </>
    );
};
