import React, { CSSProperties, ReactElement, useRef, useState } from 'react';

import { Placement, Popover } from 'LumX';

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
    width: '100%',
};

const demoPopoverHolderStyle: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: 200,
    justifyContent: 'space-around',
};

/////////////////////////////

/**
 * The demo for the default <Popover>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): ReactElement => {
    const [isTooltipDisplayed, setTooltipDisplayed] = useState(false);
    const anchorRef = useRef(null);
    const popoverRef = useRef(null);

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
    const toggleTooltipDisplay = (newVisibleState: boolean): void => {
        setTooltipDisplayed(newVisibleState);
    };

    return (
        <>
            <div>
                <div style={demoPopoverHolderStyle}>
                    <div
                        ref={anchorRef}
                        style={{ ...demoAnchorStyle, width: 150 }}
                        onMouseEnter={(): void => toggleTooltipDisplay(true)}
                        onMouseLeave={(): void => toggleTooltipDisplay(false)}
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

/////////////////////////////

export default {
    view: DemoComponent,
};
