import { useCallback, useRef, useState } from 'react';
import { mdiPlay } from '@lumx/icons';
import { AlertDialog, Button, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [isOpen, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);
    const buttonRef = useRef(null);
    return (
        <>
            <Button leftIcon={mdiPlay} ref={buttonRef} onClick={toggle} theme={theme}>
                Try confirm dialog
            </Button>

            <AlertDialog
                isOpen={isOpen}
                parentElement={buttonRef}
                onClose={close}
                title="Confirm dialog"
                confirmProps={{ label: 'Agree', onClick: close }}
                cancelProps={{ label: 'Disagree', onClick: close }}
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper
                pharetra eu augue.
            </AlertDialog>
        </>
    );
};
