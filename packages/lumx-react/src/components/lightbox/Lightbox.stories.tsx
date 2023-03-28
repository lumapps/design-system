/* eslint-disable react-hooks/rules-of-hooks,react/display-name */
import React from 'react';
import { ImageBlock, Alignment, Lightbox, Button } from '@lumx/react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { LANDSCAPE_IMAGES } from '@lumx/react/stories/controls/image';

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
export const ImageBlock_ = {
    args: {
        children: <ImageBlock align={Alignment.center} alt="" fillHeight image={LANDSCAPE_IMAGES.landscape1} />,
    },
};

/**
 * LightBox with image block and close button
 */
export const WithCloseButton = {
    args: {
        ...ImageBlock_.args,
        closeButtonProps: { label: 'Close' },
    },
};
