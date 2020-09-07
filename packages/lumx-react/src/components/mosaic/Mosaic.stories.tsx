import { IMAGES, imageKnob } from '@lumx/react/stories/knobs';
import React, { useCallback, useRef, useState } from 'react';

import { Alignment, ImageBlock, Lightbox, Slideshow, SlideshowItem, Theme } from '@lumx/react';
import { Mosaic } from './Mosaic';

export default { title: 'LumX components/mosaic/Mosaic' };

export const oneThumbnail = ({ theme }: any) => {
    return (
        <div style={{ width: 250 }}>
            <Mosaic theme={theme} thumbnails={[{ image: imageKnob('Image', IMAGES.landscape1) }]} />
        </div>
    );
};

export const twoThumbnails = ({ theme }: any) => {
    return (
        <div style={{ width: 250 }}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    { image: imageKnob('Image 1', IMAGES.landscape1) },
                    { image: imageKnob('Image 2', IMAGES.landscape2) },
                ]}
            />
        </div>
    );
};

export const threeThumbnails = ({ theme }: any) => {
    return (
        <div style={{ width: 250 }}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    { image: imageKnob('Image 1', IMAGES.landscape1) },
                    { image: imageKnob('Image 2', IMAGES.landscape2) },
                    { image: imageKnob('Image 3', IMAGES.landscape3) },
                ]}
            />
        </div>
    );
};

export const fourThumbnails = ({ theme }: any) => {
    return (
        <div style={{ width: 250 }}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    { image: imageKnob('Image 1', IMAGES.landscape1) },
                    { image: imageKnob('Image 2', IMAGES.landscape2) },
                    { image: imageKnob('Image 3', IMAGES.landscape3) },
                    { image: imageKnob('Image 4', IMAGES.portrait1) },
                ]}
            />
        </div>
    );
};

export const clickableThumbnails = ({ theme }: any) => {
    const onClick = (index: number) => alert(`Clicked n°${index}`);

    return (
        <div style={{ width: 250 }}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    { image: imageKnob('Image 1', IMAGES.landscape1), onClick },
                    { image: imageKnob('Image 2', IMAGES.landscape2), onClick },
                    { image: imageKnob('Image 3', IMAGES.landscape3), onClick },
                    { image: imageKnob('Image 4', IMAGES.portrait1), onClick },
                ]}
            />
        </div>
    );
};

export const sixThumbnails = ({ theme }: any) => {
    const [activeIndex, setActiveIndex] = useState<number>();
    const lightBoxParent = useRef(null);
    const thumbnails = [
        { onClick: setActiveIndex, image: imageKnob('Image 1', IMAGES.landscape1) },
        { onClick: setActiveIndex, image: imageKnob('Image 2', IMAGES.landscape2) },
        { onClick: setActiveIndex, image: imageKnob('Image 3', IMAGES.landscape3) },
        { onClick: setActiveIndex, image: imageKnob('Image 4', IMAGES.portrait1) },
        { onClick: setActiveIndex, image: imageKnob('Image 5', IMAGES.portrait2) },
        { onClick: setActiveIndex, image: imageKnob('Image 6', IMAGES.square1) },
    ];
    const closeLightBox = useCallback(() => {
        setActiveIndex(0);
    }, [setActiveIndex]);

    return (
        <div ref={lightBoxParent} style={{ width: 250 }}>
            <Mosaic theme={theme} thumbnails={thumbnails} />

            <Lightbox
                isOpen={activeIndex !== undefined && activeIndex !== null}
                parentElement={lightBoxParent}
                onClose={closeLightBox}
            >
                <Slideshow activeIndex={activeIndex} hasControls={true} fillHeight={true} theme={Theme.dark}>
                    {thumbnails.map((th, idx) => {
                        return (
                            <SlideshowItem key={`${th.image}-${idx}`}>
                                <ImageBlock
                                    image={th.image}
                                    align={Alignment.center}
                                    fillHeight={true}
                                    theme={Theme.dark}
                                />
                            </SlideshowItem>
                        );
                    })}
                </Slideshow>
            </Lightbox>
        </div>
    );
};
