import { useCallback, useRef, useState } from 'react';
import { mdiPlay } from '@lumx/icons';
import { Button, Dialog, Toolbar, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [isOpen, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);
    const buttonRef = useRef(null);
    return (
        <>
            <Button leftIcon={mdiPlay} ref={buttonRef} onClick={toggle} theme={theme}>
                Try dialog
            </Button>

            <Dialog isOpen={isOpen} parentElement={buttonRef} onClose={close}>
                <header>
                    <Toolbar label={<span className="lumx-typography-title">Default dialog</span>} />
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
                                <Button emphasis="medium" onClick={close}>
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
