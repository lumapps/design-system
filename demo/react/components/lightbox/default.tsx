import React, { Fragment, useCallback, useRef, useState } from 'react';

import { Button, Lightbox, LightboxTheme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: LightboxTheme;
}

/////////////////////////////

/**
 * The demo for the default <Lightbox>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const [isOpened, setIsOpened]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    // tslint:disable-next-line: no-any
    const triggerElement: React.RefObject<any> = useRef(null);

    const onOpenModal: () => void = useCallback(() => {
        // Do something.
    }, []);

    const onCloseModal: () => void = useCallback(() => {
        // Do something.
        setIsOpened(false);
    }, []);

    const handleClick: () => void = useCallback(() => {
        setIsOpened(!isOpened);
    }, [isOpened]);

    return (
        <Fragment>
            <Button
                buttonRef={triggerElement}
                aria-label="Close Modal"
                type="button"
                onClick={handleClick}
                theme={theme}
            >
                Open Lightbox
            </Button>

            <Lightbox
                isOpen={isOpened}
                parentElement={triggerElement}
                onClose={onCloseModal}
                onOpen={onOpenModal}
                theme={theme}
            >
                <div style={{ backgroundColor: 'white', height: '400px', overflow: 'auto', width: '500px' }}>
                    <b>Hello World</b>
                    <br />
                    <input type="text" />
                    <br />
                </div>
            </Lightbox>
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
