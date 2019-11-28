import React from 'react';

import { Placement, Popover } from '@lumx/react';

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
        width: '100%',
    };

    const demoPopoverHolderStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 200,
        justifyContent: 'space-around',
    };

    const [isTooltipDisplayed, setTooltipDisplayed] = React.useState(false);
    const anchorRef = React.useRef(null);
    const popoverRef = React.useRef(null);

    const { computedPosition, isVisible } = Popover.useComputePosition(
        Placement.BOTTOM_END,
        anchorRef,
        popoverRef,
        isTooltipDisplayed,
        { horizontal: 0, vertical: 0 },
        true,
        true,
    );

    /**
     * Switch tooltip visibility
     * @param newVisibleState Tooltip visibility
     */
    const toggleTooltipDisplay = (newVisibleState) => {
        setTooltipDisplayed(newVisibleState);
    };

    return (
        <>
            <div>
                <div style={demoPopoverHolderStyle}>
                    <div
                        ref={anchorRef}
                        style={{ ...demoAnchorStyle, width: 150 }}
                        onMouseEnter={() => toggleTooltipDisplay(true)}
                        onMouseLeave={() => toggleTooltipDisplay(false)}
                    >
                        {'This element will act as the anchor'}
                    </div>
                </div>
            </div>

            <Popover popoverRef={popoverRef} isVisible={isVisible} popoverRect={computedPosition}>
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
