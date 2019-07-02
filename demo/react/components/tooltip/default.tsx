import React, { Fragment, useRef } from 'react';

import { Button, ButtonTheme, Tooltip } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ButtonTheme;
}

/////////////////////////////

/**
 * The demo for the default <Tooltip>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const anchorRefTop: React.RefObject<HTMLElement> = useRef<HTMLElement>(null);
    const anchorRefRight: React.RefObject<HTMLElement> = useRef<HTMLElement>(null);
    const anchorRefBottom: React.RefObject<HTMLElement> = useRef<HTMLElement>(null);
    const anchorRefLeft: React.RefObject<HTMLElement> = useRef<HTMLElement>(null);
    const anchorRefDelay: React.RefObject<HTMLElement> = useRef<HTMLElement>(null);

    return (
        <Fragment>
            <Button buttonRef={anchorRefTop} theme={theme}>
                Top
            </Button>{' '}
            <Button buttonRef={anchorRefRight} theme={theme}>
                Right
            </Button>{' '}
            <Button buttonRef={anchorRefBottom} theme={theme}>
                Bottom
            </Button>{' '}
            <Button buttonRef={anchorRefLeft} theme={theme}>
                Left
            </Button>{' '}
            <Button buttonRef={anchorRefDelay} theme={theme}>
                With 2s delay
            </Button>
            <Tooltip anchorRef={anchorRefTop} placement="top" theme={theme}>
                Top Tooltip
            </Tooltip>
            <Tooltip anchorRef={anchorRefRight} placement="right" theme={theme}>
                Right Tooltip
            </Tooltip>
            <Tooltip anchorRef={anchorRefBottom} placement="bottom" theme={theme}>
                Bottom Tooltip
            </Tooltip>
            <Tooltip anchorRef={anchorRefLeft} placement="left" theme={theme}>
                Left Tooltip
            </Tooltip>
            <Tooltip anchorRef={anchorRefDelay} delay={2000} placement="bottom" theme={theme}>
                Tooltip with delay
            </Tooltip>
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
