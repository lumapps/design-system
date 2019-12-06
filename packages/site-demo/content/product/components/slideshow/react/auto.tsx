import React from 'react';

import { ImageBlock, Slideshow, SlideshowItem, ThumbnailAspectRatio } from '@lumx/react';

const App = ({ theme }) => {
    const slideshowStyle = {
        width: '50%',
    };

    return (
        <Slideshow activeIndex={0} hasControls={true} theme={theme} autoPlay={true} groupBy={1} style={slideshowStyle}>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=31"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=1"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=2"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=8"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=3"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=4"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=5"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=36"
                    theme={theme}
                />
            </SlideshowItem>
            <SlideshowItem>
                <ImageBlock
                    aspectRatio={ThumbnailAspectRatio.vertical}
                    image="https://picsum.photos/480/640/?image=7"
                    theme={theme}
                />
            </SlideshowItem>
        </Slideshow>
    );
};

export default App;
