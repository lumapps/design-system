/* eslint-disable @typescript-eslint/no-use-before-define */
import { Button } from '@lumx/react';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import React, { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default {
    title: 'LumX components/ClickAwayProvider',
    parameters: {
        // Disables Chromatic snapshot (not relevant for this story).
        chromatic: { disable: true },
    },
};

// eslint-disable-next-line react/display-name
const Card = React.forwardRef<any, any>(({ children, close }, ref) => (
    <ClickAwayProvider callback={close} refs={[ref as any]}>
        {createPortal(
            <div className="lumx-spacing-padding" ref={ref} style={{ border: '1px solid red' }}>
                {children}
            </div>,
            document.body,
        )}
    </ClickAwayProvider>
));

/**
 * This story showcases the detection of click away inside a nested React portal tree.
 *
 * @return Component story.
 */
export const NestedClickAway = () => {
    const ref1 = useRef<HTMLDivElement>();
    const [isOpen1, setOpen1] = useState(false);
    const open1 = useCallback(() => setOpen1(true), []);
    const close1 = useCallback(() => {
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
    }, []);

    const ref2 = useRef<HTMLDivElement>();
    const [isOpen2, setOpen2] = useState(false);
    const open2 = useCallback(() => setOpen2(true), []);
    const close2 = useCallback(() => {
        setOpen2(false);
        setOpen3(false);
    }, []);

    const ref3 = useRef<HTMLDivElement>();
    const [isOpen3, setOpen3] = useState(false);
    const open3 = useCallback(() => setOpen3(true), []);
    const close3 = useCallback(() => setOpen3(false), []);

    return (
        <>
            Level 0 - <Button onClick={open1}>Open level 1</Button>
            {isOpen1 && (
                <Card ref={ref1} close={close1}>
                    Level 1 - <Button onClick={open2}>Open level 2</Button>
                    {isOpen2 && (
                        <Card ref={ref2} close={close2}>
                            Level 2 - <Button onClick={open3}>Open level 3</Button>
                            {isOpen3 && (
                                <Card ref={ref3} close={close3}>
                                    Level 3
                                </Card>
                            )}
                        </Card>
                    )}
                </Card>
            )}
        </>
    );
};
