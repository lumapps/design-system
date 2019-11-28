import React from 'react';

import { Button, Emphasis, Placement, Popover, Size } from '@lumx/react';

const App = ({ theme }) => {
    const demoAnchorStyle = {
        border: '1px solid grey',
        cursor: 'default',
        fontSize: '12px',
        padding: '5px',
        textAlign: 'center',
        width: '100px',
    };

    const demoPopperStyle = {
        backgroundColor: 'black',
        borderRadius: '3px',
        color: 'white',
        fontSize: '10px',
        padding: '5px',
        width: '266px',
    };

    const demoPopoverHolderStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 200,
        justifyContent: 'center',
    };

    const [isTooltipDisplayed, setTooltipDisplayed] = React.useState(false);
    const anchorRef = React.useRef(null);
    const popoverRef = React.useRef(null);

    /**
     * Switch tooltip visibility.
     */
    const toggleTooltipDisplay = () => {
        setTooltipDisplayed(!isTooltipDisplayed);
    };

    const { computedPosition, isVisible } = Popover.useComputePosition(
        Placement.RIGHT_END,
        anchorRef,
        popoverRef,
        isTooltipDisplayed,
    );

    return (
        <>
            <div>
                <Button theme={theme} size={Size.s} emphasis={Emphasis.high} onClick={toggleTooltipDisplay}>
                    Toggle visibility
                </Button>

                <div style={demoPopoverHolderStyle}>
                    <div ref={anchorRef} style={demoAnchorStyle}>
                        {'This element will act as the anchor'}
                    </div>
                </div>
            </div>

            <Popover popoverRect={computedPosition} popoverRef={popoverRef} isVisible={isVisible}>
                <div style={demoPopperStyle}>
                    {
                        'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consequat. '
                    }
                </div>
            </Popover>
        </>
    );
};

export default App;
