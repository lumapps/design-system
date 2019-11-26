import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Alignment, Dialog, Grid, GridItem, Button, Toolbar, ButtonEmphasis, Size, Orientation } from '@lumx/react';

const App = ({ theme }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [selectedSize, setSelectedSize] = useState();

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
        <Grid
            theme={theme}
                orientation={Orientation.horizontal}
                vAlign={Alignment.center}
                hAlign={Alignment.top}
                gutter={Size.regular}
            >
            <GridItem style={{margin:'0 4px'}}>
                <Button
                    buttonRef={triggerElement}
                    aria-label="tiny Modal"
                    type="button"
                    onClick={() => {setSelectedSize(Size.tiny); setIsOpened(!isOpened);}}
                    theme={theme}
                >
                    tiny
                </Button>
            </GridItem>
            <GridItem style={{margin:'0 4px'}}>
                <Button
                    buttonRef={triggerElement}
                    aria-label="regular Modal"
                    type="button"
                    onClick={() => {setSelectedSize(Size.regular); setIsOpened(!isOpened);}}
                    theme={theme}
                >
                    regular
                </Button>
            </GridItem>
            <GridItem style={{margin:'0 4px'}}>
                <Button
                    buttonRef={triggerElement}
                    aria-label="big Modal"
                    type="button"
                    onClick={() => {setSelectedSize(Size.big); setIsOpened(!isOpened);}}
                    theme={theme}
                >
                    big
                </Button>
            </GridItem>
            <GridItem style={{margin:'0 4px'}}>
                <Button
                    buttonRef={triggerElement}
                    aria-label="huge Modal"
                    type="button"
                    onClick={() => {setSelectedSize(Size.huge); setIsOpened(!isOpened);}}
                    theme={theme}
                >
                    huge
                </Button>
            </GridItem>

        </Grid>
            <Dialog
                theme={theme}
                isOpen={isOpened}
                parentElement={triggerElement}
                onClose={onCloseModal}
                onOpen={onOpenModal}
                header={<Toolbar label={<span className="lumx-typography-title">Dialog</span>} />}
                footer={<Toolbar after={footerBtns} />}
                size={selectedSize}
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
