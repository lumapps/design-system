import React, { useCallback, useRef, useState } from 'react';

import { Alignment, ImageBlock, Lightbox, Slideshow, SlideshowItem, Theme } from '@lumx/react';
import { Mosaic } from './Mosaic';

export default { title: 'LumX components/Mosaic' };

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

export const clickableThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };
    const onClick = (index: number) => alert(`Clicked n°${index}`);

    return (
        <div style={wrapperStyle}>
            <Mosaic
                theme={theme}
                thumbnails={[
                    { url: 'https://picsum.photos/200', onClick },
                    { url: 'https://picsum.photos/210', onClick },
                    { url: 'https://picsum.photos/220', onClick },
                    { url: 'https://picsum.photos/230', onClick },
                ]}
            />
        </div>
    );
};

export const sixThumbnails = ({ theme }: any) => {
    const wrapperStyle = { width: 250 };
    const [activeIndex, setActiveIndex] = useState<number>();
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
        setActiveIndex(0);
    }, [setActiveIndex]);

    return (
        <div ref={lightBoxParent} style={wrapperStyle}>
            <Mosaic theme={theme} thumbnails={thumbnails} />

            <Lightbox
                isOpen={activeIndex !== undefined && activeIndex !== null}
                parentElement={lightBoxParent}
                onClose={closeLightBox}
            >
                <Slideshow activeIndex={activeIndex} hasControls={true} fillHeight={true} theme={Theme.dark}>
                    {thumbnails.map((th, idx) => {
                        return (
                            <SlideshowItem key={`${th.url}-${idx}`}>
                                <ImageBlock
                                    image={th.url}
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
