/* eslint-disable react-hooks/rules-of-hooks */
import { forwardRef, useCallback, useRef, useState } from 'react';
import { Button } from '@lumx/react';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { Portal, PortalProvider } from '@lumx/react/utils/Portal';
import { setup } from '@lumx/core/js/utils/ClickAway/TestStories';

// eslint-disable-next-line react/display-name
const Card = forwardRef(({ children, close }: any, ref: any) => (
    <ClickAwayProvider callback={close} childrenRefs={useRef([ref])}>
        <Portal>
            <div className="lumx-spacing-padding" ref={ref} style={{ border: '1px solid red' }}>
                {children}
            </div>
        </Portal>
    </ClickAwayProvider>
));

const ButtonWithCard = ({ level }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setOpen] = useState(false);
    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);
    const nextLevel = level + 1;

    return (
        <>
            Level {level} - <Button onClick={open}>Open level {nextLevel}</Button>
            {isOpen && (
                <Card ref={ref} close={close}>
                    {nextLevel === 4 ? `Level ${nextLevel}` : <ButtonWithCard level={nextLevel} />}
                </Card>
            )}
        </>
    );
};

const { meta, ...stories } = setup({
    component: ClickAwayProvider,
    components: { PortalProvider, ButtonWithCard },
});

export default {
    title: 'utils/clickaway/ClickAwayProvider',
    ...meta,
};

export const NestedClickAway = { ...stories.NestedClickAway };
export const InShadowDOM = { ...stories.InShadowDOM };
export const TestClickAwayCloses = { ...stories.TestClickAwayCloses };
export const TestNestedClickAway = { ...stories.TestNestedClickAway };
