import { mdiPlay } from '@lumx/icons';
import { Button, Dialog, DialogSizes, Emphasis, Size, Toolbar } from '@lumx/react';
import React, { useCallback, useRef, useState } from 'react';

export const App = ({ theme }: any) => {
    const [size, setSize] = useState<DialogSizes>();

    const [isOpen, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);

    const buttonRef = useRef(null);

    const onClickSize = (newSize: DialogSizes) => () => {
        setSize(newSize);
        toggle();
    };

    return (
        <>
            <Button
                className="lumx-spacing-margin-horizontal-tiny"
                leftIcon={mdiPlay}
                buttonRef={buttonRef}
                onClick={onClickSize(Size.tiny)}
                theme={theme}
            >
                Tiny
            </Button>

            <Button
                className="lumx-spacing-margin-horizontal-tiny"
                leftIcon={mdiPlay}
                buttonRef={buttonRef}
                onClick={onClickSize(Size.regular)}
                theme={theme}
            >
                Regular
            </Button>

            <Button
                className="lumx-spacing-margin-horizontal-tiny"
                leftIcon={mdiPlay}
                buttonRef={buttonRef}
                onClick={onClickSize(Size.big)}
                theme={theme}
            >
                Big
            </Button>

            <Button
                className="lumx-spacing-margin-horizontal-tiny"
                leftIcon={mdiPlay}
                buttonRef={buttonRef}
                onClick={onClickSize(Size.huge)}
                theme={theme}
            >
                Huge
            </Button>

            <Dialog isOpen={isOpen} parentElement={buttonRef} onClose={close} size={size}>
                <header>
                    <Toolbar label={<span className="lumx-typography-title">Dialog</span>} />
                </header>

                <p className="lumx-spacing-padding-horizontal-huge">
                    Nihil hic munitissimus habendi senatus locus, nihil horum? At nos hinc posthac, sitientis piros
                    Afros. Magna pars studiorum, prodita quaerimus. Integer legentibus erat a ante historiarum dapibus.
                    Praeterea iter est quasdam res quas ex communi. Ullamco laboris nisi ut aliquid ex ea commodi
                    consequat. Inmensae subtilitatis, obscuris et malesuada fames. Me non paenitet nullum festiviorem
                    excogitasse ad hoc. Cum ceteris in veneratione tui montes, nascetur mus. Etiam habebis sem dicantur
                    magna mollis euismod. Quis aute iure reprehenderit in voluptate velit esse. Phasellus laoreet lorem
                    vel dolor tempus vehicula. Ambitioni dedisse scripsisse iudicaretur. Paullum deliquit, ponderibus
                    modulisque suis ratio utitur. Ab illo tempore, ab est sed immemorabili. Nec dubitamus multa iter
                    quae et nos invenerat. Tu quoque, Brute, fili mi, nihil timor populi, nihil! Morbi fringilla
                    convallis sapien, id pulvinar odio volutpat. Cras mattis iudicium purus sit amet fermentum. Vivamus
                    sagittis lacus vel augue laoreet rutrum faucibus. Quisque ut dolor gravida, placerat libero vel,
                    euismod.
                </p>

                <footer>
                    <Toolbar
                        after={
                            <>
                                <Button emphasis={Emphasis.medium} onClick={close}>
                                    Cancel
                                </Button>
                                <Button className="lumx-spacing-margin-left-regular" onClick={close}>
                                    Save
                                </Button>
                            </>
                        }
                    />
                </footer>
            </Dialog>
        </>
    );
};
