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
const Card = React.forwardRef(({ top, children, close }, ref) => (
    <ClickAwayProvider callback={close} childrenRefs={useRef([ref])}>
        {createPortal(
            <div
                className="lumx-spacing-padding"
                ref={ref}
                style={{ position: 'absolute', top, border: '1px solid red' }}
            >
                {children}
            </div>,
            document.body,
        )}
    </ClickAwayProvider>
));

const ButtonWithCard = ({ level, parentRef }) => {
    const ref3 = useRef();
    const [isOpen3, setOpen3] = useState(false);
    const open3 = useCallback(() => setOpen3(true), []);
    const close3 = useCallback(() => setOpen3(false), []);
    const nextLevel = level + 1;

    return (
        <>
            Level {level} - <Button onClick={open3}>Open level {nextLevel}</Button>
            {isOpen3 && (
                <Card ref={ref3} close={close3} top={parentRef?.current?.getBoundingClientRect().bottom || '130px'}>
                    {nextLevel === 4 ? `Level ${nextLevel}` : <ButtonWithCard level={nextLevel} parentRef={ref3} />}
                </Card>
            )}
        </>
    );
};

/**
 * This story showcases the detection of click away inside a nested React portal tree (i.e. not nested in the DOM)
 */
export const NestedClickAway = () => (
    <>
        <p>Clicking inside a level should close all child levels but not parent levels</p>
        <ButtonWithCard level={0} />
    </>
);
