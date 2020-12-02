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
import React, { useCallback, useRef, useState } from 'react';

const images = [
    { image: '/demo-assets/portrait1.jpg' },
    { image: '/demo-assets/portrait2.jpg' },
    { image: '/demo-assets/landscape3.jpg' },
    { image: '/demo-assets/landscape2.jpg' },
];

export const App = () => {
    const [isOpen, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const triggerElement = useRef(null);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    const handleClick = useCallback(
        (newActiveIndex) => () => {
            setActiveIndex(newActiveIndex);
            setOpen(!isOpen);
        },
        [isOpen],
    );

    return (
        <div style={{ width: 536, margin: '0 auto' }}>
            <Lightbox
                isOpen={isOpen}
                parentElement={triggerElement}
                onClose={close}
                closeButtonProps={{ label: 'Close' }}
            >
                <Slideshow
                    activeIndex={activeIndex}
                    nextButtonProps={{ label: 'Next' }}
                    previousButtonProps={{ label: 'Previous' }}
                    autoPlay
                    fillHeight
                    theme={Theme.dark}
                >
                    {images.map(({ image }) => (
                        <SlideshowItem key={image}>
                            <ImageBlock
                                fillHeight
                                title="Nice Image"
                                description="What an image"
                                theme={Theme.dark}
                                image={image}
                                align={Alignment.center}
                                tags={
                                    <ChipGroup align="center">
                                        <Chip size={Size.s} theme={Theme.dark}>
                                            Tag 1
                                        </Chip>

                                        <Chip size={Size.s} theme={Theme.dark}>
                                            Tag 2
                                        </Chip>
                                    </ChipGroup>
                                }
                            />
                        </SlideshowItem>
                    ))}
                </Slideshow>
            </Lightbox>

            <FlexBox orientation={Orientation.horizontal} gap={Size.regular}>
                {images.map(({ image }, index) => (
                    <Thumbnail
                        key={image}
                        image={image}
                        size={Size.xl}
                        aspectRatio={AspectRatio.square}
                        onClick={handleClick(index)}
                    />
                ))}
            </FlexBox>

            <Message className="lumx-spacing-margin-top-big" kind={MessageKind.info} hasBackground>
                <span>Click on a picture to lauch a slideshow on lightbox mode.</span>
            </Message>
        </div>
    );
};
