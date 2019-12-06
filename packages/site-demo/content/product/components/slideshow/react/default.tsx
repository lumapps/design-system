import React from 'react';

import {
    Alignment,
    Chip,
    ChipGroup,
    ImageBlock,
    ImageBlockCaptionPosition,
    Size,
    Slideshow,
    SlideshowItem,
    ThumbnailAspectRatio,
} from '@lumx/react';

const App = ({ theme }) => {
    const slideshowStyle = {
        width: '50%',
    };

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

    return (
        <div className="demo-grid">
            <Slideshow
                activeIndex={0}
                hasControls={true}
                theme={theme}
                autoPlay={false}
                groupBy={1}
                style={slideshowStyle}
            >
                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=31"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=1"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=2"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=8"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=3"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=4"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=5"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=36"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        captionPosition={ImageBlockCaptionPosition.over}
                        image="https://picsum.photos/640/480/?image=7"
                        theme={theme}
                        {...imageBlockDemoProps}
                    />
                </SlideshowItem>
            </Slideshow>
        </div>
    );
};

export default App;
