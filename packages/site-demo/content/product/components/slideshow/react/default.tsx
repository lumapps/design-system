import {
    Alignment,
    AspectRatio,
    Chip,
    ChipGroup,
    ImageBlock,
    ImageBlockCaptionPosition,
    Size,
    Slideshow,
    SlideshowItem,
} from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    const imageBlockDemoProps = {
        description: 'What an image',
        tags: (
            <ChipGroup align={Alignment.left}>
                <Chip size={Size.s} theme={theme}>
                    Tag 1
                </Chip>

                <Chip size={Size.s} theme={theme}>
                    Tag 2
                </Chip>
            </ChipGroup>
        ),
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
            groupBy={1}
            style={{ width: '50%' }}
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
