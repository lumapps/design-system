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

const App = ({ theme }: any) => {
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
        <Slideshow activeIndex={0} hasControls theme={theme} groupBy={1} style={slideshowStyle}>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=31"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=1"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=2"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=8"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=3"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=4"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=5"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=36"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>

            <SlideshowItem>
                <ImageBlock
                    aspectRatio={AspectRatio.horizontal}
                    captionPosition={ImageBlockCaptionPosition.over}
                    image="https://picsum.photos/640/480/?image=7"
                    theme={theme}
                    {...imageBlockDemoProps}
                />
            </SlideshowItem>
        </Slideshow>
    );
};

export default App;
