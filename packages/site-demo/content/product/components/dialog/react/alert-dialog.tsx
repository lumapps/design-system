import { useCallback, useRef, useState } from 'react';
import { mdiPlay } from '@lumx/icons';
import { AlertDialog, Button, type Kind, type Theme } from '@lumx/react';
import { classNames } from '@lumx/core/js/utils';

export default ({ theme }: { theme?: Theme }) => {
    const [kind, setKind] = useState<Kind>();
    const [isOpen, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const buttonRef = useRef(null);
    const open = (k: Kind) => () => {
        setKind(k);
        setOpen(true);
    };
    return (
        <>
            <Button
                className={classNames.margin('right', 'regular')}
                leftIcon={mdiPlay}
                ref={buttonRef}
                onClick={open('warning')}
                theme={theme}
            >
                Warning
            </Button>

            <Button
                className={classNames.margin('right', 'regular')}
                leftIcon={mdiPlay}
                ref={buttonRef}
                onClick={open('error')}
                theme={theme}
            >
                Error
            </Button>

            <Button leftIcon={mdiPlay} ref={buttonRef} onClick={open('success')} theme={theme}>
                Success
            </Button>

            <AlertDialog
                isOpen={isOpen}
                parentElement={buttonRef}
                onClose={close}
                kind={kind}
                title="Alert dialog"
                confirmProps={{ label: 'Ok', onClick: close }}
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sit amet urna quis nisi sodales semper
                pharetra eu augue.
            </AlertDialog>
        </>
    );
};
