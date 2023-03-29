import React from 'react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { PopoverDialog } from '.';
import { Button } from '../button';

export default {
    title: 'LumX components/popover-dialog/PopoverDialog',
    component: PopoverDialog,
};

/**
 * Example PopoverDialog using a button as a trigger
 */
export const WithButtonTrigger = () => {
    const anchorRef = React.useRef(null);
    const [isOpen, close, open] = useBooleanState(true);

    return (
        <>
            <Button id="trigger-button-1" ref={anchorRef} onClick={open}>
                Open popover
            </Button>
            <PopoverDialog
                aria-labelledby="trigger-button-1"
                anchorRef={anchorRef}
                isOpen={isOpen}
                onClose={close}
                placement="bottom"
            >
                <Button className="lumx-spacing-margin-huge" onClick={close}>
                    Close
                </Button>
            </PopoverDialog>
        </>
    );
};
