import React from 'react';

import { Popover, Placement } from '@lumx/react';

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

    const anchorRef = React.useRef(null);
    const popoverRef = React.useRef(null);

    const [selectedPlacement, setSelectedPlacement] = React.useState(Placement.AUTO);
    const [isTooltipDisplayed, setTooltipDisplayed] = React.useState(false);
    const availablePlacement = [
        Placement.AUTO,
        Placement.AUTO_END,
        Placement.AUTO_START,
        Placement.BOTTOM,
        Placement.BOTTOM_END,
        Placement.BOTTOM_START,
        Placement.LEFT,
        Placement.LEFT_END,
        Placement.LEFT_START,
        Placement.RIGHT,
        Placement.RIGHT_END,
        Placement.RIGHT_START,
        Placement.TOP,
        Placement.TOP_END,
        Placement.TOP_START,
    ];

    const { computedPosition, isVisible } = Popover.useComputePosition(
        selectedPlacement,
        anchorRef,
        popoverRef,
        isTooltipDisplayed,
    );

    function toggleTooltipDisplay(newVisibleState) {
        setTooltipDisplayed(newVisibleState);
    }

    return (
        <div
            onMouseEnter={() => toggleTooltipDisplay(true)}
            onMouseLeave={() => toggleTooltipDisplay(false)}
        >
            <select
                onChange={(evt) =>
                    setSelectedPlacement(evt.target.value)
                }
            >
                {availablePlacement.map((pos, index) => (
                    <option key={index}>{pos}</option>
                ))}
            </select>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div ref={anchorRef} style={demoAnchorStyle}>
                    {'This element will act as the anchor'}
                </div>

                <Popover popoverRect={computedPosition} isVisible={isVisible} popoverRef={popoverRef}>
                    <div style={demoPopperStyle}>
                        {
                            'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consequat. '
                        }
                    </div>
                </Popover>
            </div>
        </div>
    );
};

export default App;
