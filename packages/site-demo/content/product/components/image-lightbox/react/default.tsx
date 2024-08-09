import React from 'react';
import { FlexBox, Message, Text, Thumbnail, ImageLightbox } from '@lumx/react';

const images = [
    { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
    { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
    { image: '/demo-assets/landscape3.jpg', alt: 'Landscape 3' },
    { image: '/demo-assets/landscape2.jpg', alt: 'Landscape 2' },
];

export const App = () => {
    const { getTriggerProps, imageLightboxProps } = ImageLightbox.useImageLightbox({ images });

    return (
        <>
            <FlexBox orientation="vertical" gap="big">
                <FlexBox orientation="horizontal" gap="regular">
                    {images.map(({ image, alt }, index) => (
                        <Thumbnail
                            key={image}
                            image={image}
                            alt={alt}
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
                    paginationItemProps: (index: number) => ({ label: `Go to slide ${index + 1}` }),
                }}
            />
        </>
    );
};
