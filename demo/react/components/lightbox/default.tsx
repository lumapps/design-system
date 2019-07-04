import React, { ReactElement, useCallback, useRef, useState } from 'react';

import { Alignment, Button, ImageBlock, ImageBlockProps, Lightbox, Slideshow, SlideshowItem, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

const imageBlockDemoProps: Partial<ImageBlockProps> = {
    align: Alignment.center,
    description: 'What an image',
    fillHeight: true,
    tags: ['#tag1', '#tag2', '#tag3'],
    theme: Theme.dark,
    title: 'Nice Image',
};

/**
 * The demo for the default <Lightbox>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [isOpened, setIsOpened] = useState<boolean>(false);

    const triggerElement = useRef<Button>(null);

    const onOpenModal = useCallback(() => {
        // Do something.
    }, []);

    const onCloseModal = useCallback(() => {
        // Do something.
        setIsOpened(false);
    }, []);

    const handleClick = useCallback(() => {
        setIsOpened(!isOpened);
    }, [isOpened]);

    return (
        <>
            <Button
                buttonRef={triggerElement}
                aria-label="Close Modal"
                type="button"
                onClick={handleClick}
                theme={theme}
            >
                Open Lightbox
            </Button>

            <Lightbox
                isOpen={isOpened}
                parentElement={triggerElement}
                onClose={onCloseModal}
                onOpen={onOpenModal}
                theme={theme}
            >
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

/////////////////////////////

export default {
    view: DemoComponent,
};
