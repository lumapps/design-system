import { AspectRatio, ImageBlock, ImageBlockCaptionPosition, Slideshow, SlideshowItem } from '@lumx/react';
import React from 'react';

export default { title: 'LumX components/slideshow/Slideshow' };

export const Simple = ({ theme }: any) => {
    const slideshowStyle = {
        width: '50%',
    };

    return (
        <Slideshow activeIndex={0} hasControls theme={theme} groupBy={1} style={slideshowStyle}>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=31"
                    theme={theme}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=1"
                    theme={theme}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=2"
                    theme={theme}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=8"
                    theme={theme}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=3"
                    theme={theme}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=4"
                    theme={theme}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=5"
                    theme={theme}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=36"
                    theme={theme}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=7"
                    theme={theme}
                />
            </SlideshowItem>
        </Slideshow>
    );
};
