import { AspectRatio, ImageBlock, ImageBlockCaptionPosition, Slideshow, SlideshowItem } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    const imageBlockDemoProps = {
        description: 'What an image',
        title: 'Nice Image',
    };

    const images = [
        '/demo-assets/landscape1.jpg',
        '/demo-assets/portrait1.jpg',
        '/demo-assets/landscape2.jpg',
        '/demo-assets/portrait2.jpg',
        '/demo-assets/landscape3.jpg',
        '/demo-assets/portrait3.jpg',
    ];

    return (
        <Slideshow
            activeIndex={0}
            slideshowControlsProps={{
                nextButtonProps: { label: 'Next' },
                previousButtonProps: { label: 'Previous' },
            }}
            theme={theme}
            autoPlay
            groupBy={2}
            style={{ width: '100%' }}
        >
            {images.map((image) => (
                <SlideshowItem key={image}>
                    <ImageBlock
                        captionPosition={ImageBlockCaptionPosition.over}
                        image={image}
                        theme={theme}
                        thumbnailProps={{ aspectRatio: AspectRatio.horizontal }}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>
            ))}
        </Slideshow>
    );
};
