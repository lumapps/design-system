import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Dialog, Button, Toolbar, ButtonEmphasis } from '@lumx/react';

const App = ({ theme }) => {
    const [isOpened, setIsOpened] = useState(false);

    const triggerElement = useRef(null);

    const onOpenModal = useCallback(() => {
        // Do something.
    }, []);

    const onCloseModal = useCallback(() => {
        // Do something.
        setIsOpened(false);
    }, []);

    const handleClick = useCallback(() => {
        setIsOpened(!isOpened);
    }, [isOpened]);

    const footerBtns = useMemo(
        () => (
            <>
                <Button emphasis={ButtonEmphasis.medium} onClick={onCloseModal}>
                    Cancel
                </Button>
                <Button className="lumx-spacing-margin-left-regular" onClick={onCloseModal}>
                    Save
                </Button>
            </>
        ),
        [],
    );

    return (
        <>
            <Button
                buttonRef={triggerElement}
                aria-label="Modal"
                type="button"
                onClick={handleClick}
                theme={theme}
            >
                Open dialog
            </Button>

            <Dialog
                theme={theme}
                isOpen={isOpened}
                parentElement={triggerElement}
                onClose={onCloseModal}
                onOpen={onOpenModal}
                header={<Toolbar label={<span className="lumx-typography-title">Default dialog</span>} />}
                footer={<Toolbar after={footerBtns} />}
            >
                <div className="lumx-spacing-padding-horizontal-huge">
                <p>
                Nihil hic munitissimus habendi senatus locus, nihil horum? At nos hinc posthac, sitientis piros Afros.
                Magna pars studiorum, prodita quaerimus. Integer legentibus erat a ante historiarum dapibus. Praeterea
                iter est quasdam res quas ex communi. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Inmensae
                subtilitatis, obscuris et malesuada fames. Me non paenitet nullum festiviorem excogitasse ad hoc. Cum
                ceteris in veneratione tui montes, nascetur mus. Etiam habebis sem dicantur magna mollis euismod. Quis
                aute iure reprehenderit in voluptate velit esse. Phasellus laoreet lorem vel dolor tempus vehicula.
                Ambitioni dedisse scripsisse iudicaretur. Paullum deliquit, ponderibus modulisque suis ratio utitur. Ab
                illo tempore, ab est sed immemorabili. Nec dubitamus multa iter quae et nos invenerat. Tu quoque, Brute,
                fili mi, nihil timor populi, nihil! Morbi fringilla convallis sapien, id pulvinar odio volutpat. Cras
                mattis iudicium purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus.
                Quisque ut dolor gravida, placerat libero vel, euismod.
            </p>
                </div>
            </Dialog>
        </>
    );
}

export default App;
