import { Alignment, ImageBlock, Lightbox, Mosaic, Slideshow, SlideshowItem, Theme } from '@lumx/react';
import React, { useRef, useState } from 'react';

const IMAGES = [{ image: '/demo-assets/portrait1.jpg' }, { image: '/demo-assets/portrait2.jpg' }];

export const App = () => {
    const [isOpen, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const triggerElement = useRef(null);

    const close = () => {
        setOpen(false);
    };

    const handleClick = (newActiveIndex: number) => {
        setActiveIndex(newActiveIndex);
        setOpen(!isOpen);
    };

    return (
        <>
            <div style={{ width: 250 }}>
                <Mosaic thumbnails={IMAGES} onImageClick={handleClick} />
            </div>

            <Lightbox isOpen={isOpen} parentElement={triggerElement} onClose={close}>
                <Slideshow activeIndex={activeIndex} hasControls autoPlay fillHeight theme={Theme.dark}>
                    {IMAGES.map(({ image }) => (
                        <SlideshowItem key={image}>
                            <ImageBlock image={image} fillHeight align={Alignment.center} />
                        </SlideshowItem>
                    ))}
                </Slideshow>
            </Lightbox>
        </>
    );
};
