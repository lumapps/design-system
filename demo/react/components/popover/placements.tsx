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
    width: '266px',
};

/**
 * The demo for the default <Popover>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): ReactElement => {
    const anchorRef = useRef(null);
    const popoverRef = useRef(null);

    const [selectedPlacement, setSelectedPlacement] = useState(Placement.AUTO);
    const [isTooltipDisplayed, setTooltipDisplayed] = useState(false);
    const availablePlacement: string[] = [
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

    function toggleTooltipDisplay(newVisibleState: boolean): void {
        setTooltipDisplayed(newVisibleState);
    }

    return (
        <div
            onMouseEnter={(): void => toggleTooltipDisplay(true)}
            onMouseLeave={(): void => toggleTooltipDisplay(false)}
        >
            <select
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void =>
                    setSelectedPlacement(evt.target.value as Placement)
                }
            >
                {availablePlacement.map((pos: string, index: number) => (
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

/////////////////////////////

export default {
    view: DemoComponent,
};
