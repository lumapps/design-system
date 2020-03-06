import React, { useCallback, useRef, useState } from 'react';

import { Alignment, ImageBlock, Lightbox, Slideshow, SlideshowItem, Theme } from '@lumx/react';
import { Mosaic } from './Mosaic';

export default { title: 'Mosaic' };

export const OneThumbnail = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };

    return (
        <div style={wrapperStyle}>
            <Mosaic theme={theme} thumbnails={[{ url: 'https://picsum.photos/200' }]} />
        </div>
    );
};

export const TwoThumbnails = ({ theme }: any) => {
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

export const ThreeThumbnails = ({ theme }: any) => {
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

export const FourThumbnails = ({ theme }: any) => {
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

export const SixThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };
    const [activeIndex, setActiveIndex] = useState();
    const lightBoxParent = useRef(null);
    const thumbnails = [
        { onClick: setActiveIndex, url: 'https://picsum.photos/640/480/?image=24' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/640/480/?image=25' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/640/480/?image=26' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/640/480/?image=27' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/640/480/?image=28' },
        { onClick: setActiveIndex, url: 'https://picsum.photos/640/480/?image=29' },
    ];
    const closeLightBox = useCallback(() => {
        setActiveIndex(null);
    }, [setActiveIndex]);

    return (
        <div ref={lightBoxParent} style={wrapperStyle}>
            <Mosaic theme={theme} thumbnails={thumbnails} />

            <Lightbox
                isOpen={activeIndex !== undefined && activeIndex !== null}
                parentElement={lightBoxParent}
                onClose={closeLightBox}
            >
                <Slideshow activeIndex={activeIndex} hasControls fillHeight theme={Theme.dark}>
                    {thumbnails.map((th) => (
                        <SlideshowItem key={th.url}>
                            <ImageBlock image={th.url} align={Alignment.center} fillHeight theme={Theme.dark} />
                        </SlideshowItem>
                    ))}
                </Slideshow>
            </Lightbox>
        </div>
    );
};
