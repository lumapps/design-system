/* eslint-disable react-hooks/rules-of-hooks,react/display-name */
import React from 'react';
import { ImageBlock, Lightbox, Button, Slideshow, SlideshowItem } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { LANDSCAPE_IMAGES, LANDSCAPE_IMAGES_ALT } from '@lumx/core/stories/controls/image';
import { setup } from '@lumx/core/js/components/Lightbox/Stories';

const { meta, ...stories } = setup({
    component: Lightbox,
    render(props: any) {
        const buttonRef = React.useRef<HTMLButtonElement>(null);
        const [isOpen, close, open] = useBooleanState(false);
        return (
            <>
                <Button ref={buttonRef} onClick={open}>
                    Open lightbox
                </Button>
                <Lightbox {...props} parentElement={buttonRef} isOpen={isOpen} onClose={close} />
            </>
        );
    },
    components: { ImageBlock },
});

export default {
    title: 'LumX components/lightbox/Lightbox',
    ...meta,
};

export const Image = { ...stories.Image };
export const WithCloseButton = { ...stories.WithCloseButton };

/**
 * Demo a LightBox containing an image slideshow.
 * Uses Slideshow/SlideshowItem which are React-only and not available in core.
 */
export const ImageSlideshow = {
    render() {
        const buttonRef = React.useRef<HTMLButtonElement>(null);
        const [isOpen, close, open] = useBooleanState(true);
        return (
            <>
                <Button ref={buttonRef} onClick={open}>
                    Open lightbox
                </Button>
                <Lightbox
                    aria-label="Fullscreen image slideshow"
                    closeButtonProps={{ label: 'Close' }}
                    parentElement={buttonRef}
                    isOpen={isOpen}
                    onClose={close}
                >
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
                </Lightbox>
            </>
        );
    },
};
