import React, { CSSProperties, ReactElement, useRef, useState } from 'react';

import { Button, ButtonEmphasis, Popover, Size } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
}

const demoAnchorStyle: CSSProperties = {
    border: '1px solid grey',
    cursor: 'default',
    fontSize: '12px',
    padding: '5px',
    textAlign: 'center',
    width: '100px',
};

const demoPopperStyle: CSSProperties = {
    backgroundColor: 'black',
    borderRadius: '3px',
    color: 'white',
    fontSize: '10px',
    padding: '5px',
    width: '266px',
};

const demoPopoverHolderStyle: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: 200,
    justifyContent: 'center',
};

/**
 * The demo for the default <Popover>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): ReactElement => {
    const [isTooltipDisplayed, setTooltipDisplayed] = useState(false);
    const anchorRef = useRef(null);

    /**
     * Switch tooltip visibility.
     */
    const toggleTooltipDisplay = (): void => {
        setTooltipDisplayed(!isTooltipDisplayed);
    };

    return (
        <>
            <div>
                <Button size={Size.s} emphasis={ButtonEmphasis.medium} onClick={toggleTooltipDisplay}>
                    Toggle visibility
                </Button>
                <div style={demoPopoverHolderStyle}>
                    <div ref={anchorRef} style={demoAnchorStyle}>
                        {'This element will act as the anchor'}
                    </div>
                </div>
            </div>
            <Popover anchorRef={anchorRef} isVisible={isTooltipDisplayed}>
                <div style={demoPopperStyle}>
                    {
                        'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consequat. '
                    }
                </div>
            </Popover>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
