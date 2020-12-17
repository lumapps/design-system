import { Alignment, ImageBlock, Lightbox, Mosaic, Slideshow, SlideshowItem, Theme, ThumbnailProps } from '@lumx/react';
import React, { useRef, useState } from 'react';

const IMAGES: ThumbnailProps[] = [
    { image: '/demo-assets/landscape1.jpg', alt: 'Landscape 1' },
    { image: '/demo-assets/landscape2.jpg', alt: 'Landscape 2' },
    { image: '/demo-assets/landscape3.jpg', alt: 'Landscape 3' },
    { image: '/demo-assets/portrait1.jpg', alt: 'Portrait 1' },
    { image: '/demo-assets/portrait2.jpg', alt: 'Portrait 2' },
    { image: '/demo-assets/portrait3.jpg', alt: 'Portrait 3' },
];

export const App = () => {
    const [activeIndex, setActiveIndex] = useState<number>();
    const triggerElement = useRef(null);
    const close = () => setActiveIndex(undefined);

    return (
        <>
            <div style={{ width: 250 }}>
                <Mosaic thumbnails={IMAGES} onImageClick={setActiveIndex} />
            </div>

            <Lightbox isOpen={activeIndex !== undefined} parentElement={triggerElement} onClose={close}>
                <Slideshow activeIndex={activeIndex} hasControls autoPlay fillHeight theme={Theme.dark}>
                    {IMAGES.map(({ image, alt }) => (
                        <SlideshowItem key={image}>
                            <ImageBlock image={image} alt={alt} fillHeight align={Alignment.center} />
                        </SlideshowItem>
                    ))}
                </Slideshow>
            </Lightbox>
        </>
    );
};
