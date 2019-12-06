import React from 'react';

import { ImageBlock, ImageBlockCaptionPosition, Slideshow, SlideshowItem, ThumbnailAspectRatio } from '@lumx/react';

const App = ({ theme }) => {
    const slideshowStyle = {
        width: '100%',
    };

    const imageBlockDemoProps = {
        description: 'What an image',
        title: 'Nice Image',
    };

    return (
        <Slideshow activeIndex={0} hasControls={true} theme={theme} autoPlay={false} groupBy={2} style={slideshowStyle}>
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
                    image="https://picsum.photos/640/480/?image=30"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=32"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=38"
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
                    image="https://picsum.photos/640/480/?image=34"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
        </Slideshow>
    );
};

export default App;
