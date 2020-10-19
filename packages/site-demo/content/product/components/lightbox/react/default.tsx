import React, { useCallback, useRef, useState } from 'react';

import {
    Alignment,
    AspectRatio,
    Chip,
    ChipGroup,
    FlexBox,
    ImageBlock,
    Lightbox,
    Message,
    MessageKind,
    Orientation,
    Size,
    Slideshow,
    SlideshowItem,
    Theme,
    Thumbnail,
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
    const [activeIndex, setActiveIndex] = useState(0);

    const triggerElement = useRef(null);

    const onOpenModal = useCallback(() => {
        // Do something.
    }, []);

    const onCloseModal = useCallback(() => {
        // Do something.
        setIsOpened(false);
    }, []);

    const handleClick = useCallback(
        (newActiveIndex) => {
            setActiveIndex(newActiveIndex);
            setIsOpened(!isOpened);
        },
        [isOpened],
    );

    return (
        <>
            <div style={{ width: 536, margin: '0 auto' }}>
                <FlexBox orientation={Orientation.horizontal} gap={Size.regular}>
                    <Thumbnail
                        image="https://picsum.photos/640/480/?image=24"
                        size={Size.xl}
                        aspectRatio={AspectRatio.square}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={() => handleClick(0)}
                    />

                    <Thumbnail
                        image="https://picsum.photos/640/480/?image=25"
                        size={Size.xl}
                        aspectRatio={AspectRatio.square}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={() => handleClick(1)}
                    />

                    <Thumbnail
                        image="https://picsum.photos/640/480/?image=26"
                        size={Size.xl}
                        aspectRatio={AspectRatio.square}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={() => handleClick(2)}
                    />

                    <Thumbnail
                        image="https://picsum.photos/640/480/?image=27"
                        size={Size.xl}
                        aspectRatio={AspectRatio.square}
                        // tslint:disable-next-line: jsx-no-lambda
                        onClick={() => handleClick(3)}
                    />
                </FlexBox>

                <Message className="lumx-spacing-margin-top-big" kind={MessageKind.info} hasBackground>
                    <span>Click on a picture to lauch a slideshow on lightbox mode.</span>
                </Message>
            </div>

            <Lightbox isOpen={isOpened} parentElement={triggerElement} onClose={onCloseModal} onOpen={onOpenModal}>
                <Slideshow
                    activeIndex={activeIndex}
                    hasControls={true}
                    autoPlay={true}
                    fillHeight={true}
                    theme={Theme.dark}
                >
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
