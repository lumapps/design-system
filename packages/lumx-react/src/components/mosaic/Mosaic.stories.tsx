import React, { useCallback, useRef, useState } from 'react';

import { AspectRatio, ImageBlock, Lightbox, Slideshow, SlideshowItem } from '@lumx/react';
import { Mosaic } from './Mosaic';

export default { title: 'Mosaic' };

export const oneThumbnail = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic theme={theme} thumbnails={[{ url: 'https://picsum.photos/200' }]} />
        </div>
    );
};

export const twoThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic
                theme={theme}
                thumbnails={[{ url: 'https://picsum.photos/200' }, { url: 'https://picsum.photos/210' }]}
            />
        </div>
    );
};

export const threeThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    { url: 'https://picsum.photos/200' },
                    { url: 'https://picsum.photos/210' },
                    { url: 'https://picsum.photos/220' },
                ]}
            />
        </div>
    );
};

export const fourThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    { url: 'https://picsum.photos/200' },
                    { url: 'https://picsum.photos/210' },
                    { url: 'https://picsum.photos/220' },
                    { url: 'https://picsum.photos/230' },
                ]}
            />
        </div>
    );
};

export const sixThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };
    const [activeIndex, setActiveIndex] = useState();
    const lightBoxParent = useRef(null);
    const thumbnails = [
        { onClick: setActiveIndex, url: 'https://picsum.photos/200' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/210' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/220' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/230' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/240' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/250' },
    ];
    const closeLightBox = useCallback(() => {
        setActiveIndex(null);
    }, [setActiveIndex]);

    return (
        <div ref={lightBoxParent} style={wrapperStyle}>
            <Mosaic theme={theme} thumbnails={thumbnails} />
            <Lightbox
                onClose={closeLightBox}
                parentElement={lightBoxParent}
                isOpen={activeIndex !== undefined && activeIndex !== null}
            >
                <Slideshow activeIndex={activeIndex} hasControls={true} theme={theme} autoPlay={false} groupBy={1}>
                    {thumbnails.map((th, idx) => {
                        return (
                            <SlideshowItem key={`${th.url}-${idx}`}>
                                <ImageBlock aspectRatio={AspectRatio.horizontal} image={th.url} theme={theme} />
                            </SlideshowItem>
                        );
                    })}
                </Slideshow>
            </Lightbox>
        </div>
    );
};
