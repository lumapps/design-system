import React from 'react';
import { Button, FlexBox, Lightbox, Thumbnail } from '@lumx/react';

export default () => {
    const [isOpen, setOpen] = React.useState(false);
    const triggerElement = React.useRef(null);
    return (
        <>
            <Button ref={triggerElement} onClick={() => setOpen(true)}>
                Open LightBox
            </Button>
            <Lightbox
                isOpen={isOpen}
                parentElement={triggerElement}
                onClose={() => setOpen(false)}
                closeButtonProps={{ label: 'Close' }}
            >
                <FlexBox vAlign="center" hAlign="center" style={{ height: '100%' }}>
                    <Thumbnail alt="Portrait image" image="/demo-assets/portrait1.jpg" />
                </FlexBox>
            </Lightbox>
        </>
    );
};
