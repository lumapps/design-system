import { useCallback, useRef, useState } from 'react';
import { mdiPlay } from '@lumx/icons';
import { Button, Dialog, Toolbar, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [isOpen, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);
    const buttonRef = useRef(null);
    return (
        <>
            <Button leftIcon={mdiPlay} ref={buttonRef} onClick={toggle} theme={theme}>
                Try alert dialog
            </Button>

            <Dialog size="tiny" isOpen={isOpen} parentElement={buttonRef} onClose={close} preventAutoClose>
                <header>
                    <Toolbar label={<span className="lumx-typography-title">Alert dialog</span>} />
                </header>

                <p className="lumx-spacing-padding-horizontal-huge">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales
                    semper pharetra eu augue.
                </p>

                <footer>
                    <Toolbar
                        after={
                            <Button className="lumx-spacing-margin-left-regular" onClick={close}>
                                Ok
                            </Button>
                        }
                    />
                </footer>
            </Dialog>
        </>
    );
};
