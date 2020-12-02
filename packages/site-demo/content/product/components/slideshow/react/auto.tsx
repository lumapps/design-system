import { AspectRatio, ImageBlock, Slideshow, SlideshowItem } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    const slideshowStyle = {
        width: '50%',
    };

    return (
        <Slideshow
            activeIndex={0}
            slideshowControlsProps={{
                nextButtonProps: { label: 'Next' },
                previousButtonProps: { label: 'Previous' },
            }}
            theme={theme}
            autoPlay
            groupBy={1}
            style={slideshowStyle}
        >
            <SlideshowItem>
                <ImageBlock
                    thumbnailProps={{ aspectRatio: AspectRatio.vertical }}
                    image="/demo-assets/landscape1.jpg"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    thumbnailProps={{ aspectRatio: AspectRatio.vertical }}
                    image="/demo-assets/landscape2.jpg"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    thumbnailProps={{ aspectRatio: AspectRatio.vertical }}
                    image="/demo-assets/landscape3.jpg"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    thumbnailProps={{ aspectRatio: AspectRatio.vertical }}
                    image="/demo-assets/portrait1.jpg"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    thumbnailProps={{ aspectRatio: AspectRatio.vertical }}
                    image="/demo-assets/portrait2.jpg"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    thumbnailProps={{ aspectRatio: AspectRatio.vertical }}
                    image="/demo-assets/portrait3.jpg"
                    theme={theme}
                />
            </SlideshowItem>
        </Slideshow>
    );
};
