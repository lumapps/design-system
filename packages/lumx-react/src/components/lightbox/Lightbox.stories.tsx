/* eslint-disable react-hooks/rules-of-hooks,react/display-name */
import React from 'react';
import { ImageBlock, Alignment, Lightbox, Button, Slideshow, SlideshowItem } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { LANDSCAPE_IMAGES, LANDSCAPE_IMAGES_ALT } from '@lumx/core/stories/controls/image';

export default {
    title: 'LumX components/lightbox/Lightbox',
    component: Lightbox,
    args: Lightbox.defaultProps,
    argTypes: {
        children: { control: false },
    },
    render: (props: any) => {
        const buttonRef = React.useRef<HTMLButtonElement>(null);
        const [isOpen, close, open] = useBooleanState(true);
        return (
            <>
                <Button ref={buttonRef} onClick={open}>
                    Open lightbox
                </Button>
                <Lightbox {...props} parentElement={buttonRef} isOpen={isOpen} onClose={close} />
            </>
        );
    },
};

/**
 * Base LightBox with image block
 */
export const Image = {
    args: {
        'aria-label': 'Fullscreen image',
        children: (
            <ImageBlock
                align={Alignment.center}
                fillHeight
                image={LANDSCAPE_IMAGES.landscape1}
                alt={LANDSCAPE_IMAGES_ALT.landscape1}
            />
        ),
    },
};

/**
 * LightBox with image block and close button
 */
export const WithCloseButton = {
    args: {
        ...Image.args,
        closeButtonProps: { label: 'Close' },
    },
};

/**
 * Demo a LightBox containing an image slideshow
 */
export const ImageSlideshow = {
    args: {
        'aria-label': 'Fullscreen image slideshow',
        closeButtonProps: { label: 'Close' },
        children: (
            <Slideshow
                aria-label="Image slideshow"
                theme="dark"
                slideshowControlsProps={{
                    nextButtonProps: { label: 'Next image' },
                    previousButtonProps: { label: 'Previous image' },
                }}
                slideGroupLabel={(currentGroup, totalGroup) => `${currentGroup} of ${totalGroup}`}
            >
                <SlideshowItem>
                    <ImageBlock
                        align="center"
                        fillHeight
                        image={LANDSCAPE_IMAGES.landscape1}
                        alt={LANDSCAPE_IMAGES_ALT.landscape1}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        align="center"
                        fillHeight
                        image={LANDSCAPE_IMAGES.landscape2}
                        alt={LANDSCAPE_IMAGES_ALT.landscape2}
                    />
                </SlideshowItem>

                <SlideshowItem>
                    <ImageBlock
                        align="center"
                        fillHeight
                        image={LANDSCAPE_IMAGES.landscape3}
                        alt={LANDSCAPE_IMAGES_ALT.landscape3}
                    />
                </SlideshowItem>
            </Slideshow>
        ),
    },
};
