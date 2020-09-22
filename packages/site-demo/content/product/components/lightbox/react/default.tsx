import React, { useCallback, useRef, useState } from 'react';

import {
    Alignment,
    Button,
    Chip,
    ChipGroup,
    ImageBlock,
    Lightbox,
    Size,
    Slideshow,
    SlideshowItem,
    Theme,
} from '@lumx/react';

const App = () => {
    const imageBlockDemoProps = {
        align: Alignment.center,
        description: 'What an image',
        fillHeight: true,
        tags: (
            <ChipGroup align="center">
                <Chip size={Size.s} theme={Theme.dark}>
                    Tag 1
                </Chip>

                <Chip size={Size.s} theme={Theme.dark}>
                    Tag 2
                </Chip>
            </ChipGroup>
        ),
        theme: Theme.dark,
        title: 'Nice Image',
    };

    const [isOpened, setIsOpened] = useState(false);

    const triggerElement = useRef(null);

    const onCloseModal = useCallback(() => {
        // Do something.
        setIsOpened(false);
    }, []);

    const handleClick = useCallback(() => {
        setIsOpened(!isOpened);
    }, [isOpened]);

    return (
        <>
            <div className="demo-grid">
                <Button buttonRef={triggerElement} aria-label="Close Modal" type="button" onClick={handleClick}>
                    Open Lightbox
                </Button>
            </div>

            <Lightbox isOpen={isOpened} parentElement={triggerElement} onClose={onCloseModal}>
                <Slideshow hasControls={true} autoPlay={true} fillHeight={true} theme={Theme.dark}>
                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=24" {...imageBlockDemoProps} />
                    </SlideshowItem>

                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=25" {...imageBlockDemoProps} />
                    </SlideshowItem>

                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=26" {...imageBlockDemoProps} />
                    </SlideshowItem>

                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=27" {...imageBlockDemoProps} />
                    </SlideshowItem>

                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=28" {...imageBlockDemoProps} />
                    </SlideshowItem>

                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=29" {...imageBlockDemoProps} />
                    </SlideshowItem>

                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=30" {...imageBlockDemoProps} />
                    </SlideshowItem>

                    <SlideshowItem>
                        <ImageBlock image="https://picsum.photos/640/480/?image=31" {...imageBlockDemoProps} />
                    </SlideshowItem>
                </Slideshow>
            </Lightbox>
        </>
    );
};

export default App;
