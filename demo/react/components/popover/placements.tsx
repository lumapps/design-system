import React, { CSSProperties, ReactNode, useState } from 'react';

import { Placements, Popover } from 'LumX';

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

const createDemoAnchor: () => ReactNode = (): ReactNode => {
    return <div style={demoAnchorStyle}>{`This element will act as the anchor`}</div>;
};

const createPopper: () => ReactNode = (): ReactNode => {
    return (
        <div style={demoPopperStyle}>
            {`Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consequat. `}
        </div>
    );
};

/**
 * The demo for the default <Popover>s.
 *
 * @return {React.ReactElement} The demo component.
 */
// tslint:disable: jsx-no-lambda
const DemoComponent: React.FC<IProps> = (): React.ReactElement => {
    // tslint:disable-next-line: typedef
    const [selectedPlacement, setSelectedPlacement] = useState(Placements.AUTO);
    // tslint:disable-next-line: typedef
    const [isTooltipDisplayed, setTooltipDisplayed] = useState(false);
    const availablePlacements: string[] = [
        Placements.AUTO,
        Placements.AUTO_END,
        Placements.AUTO_START,
        Placements.BOTTOM,
        Placements.BOTTOM_END,
        Placements.BOTTOM_START,
        Placements.LEFT,
        Placements.LEFT_END,
        Placements.LEFT_START,
        Placements.RIGHT,
        Placements.RIGHT_END,
        Placements.RIGHT_START,
        Placements.TOP,
        Placements.TOP_END,
        Placements.TOP_START,
    ];

    function toggleTooltipDisplay(newVisibleState: boolean): void {
        setTooltipDisplayed(newVisibleState);
    }

    return (
        <div onMouseOver={(): void => toggleTooltipDisplay(true)} onMouseOut={(): void => toggleTooltipDisplay(false)}>
            <select
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void =>
                    setSelectedPlacement(evt.target.value as Placements)
                }
            >
                {availablePlacements.map((pos: string) => (
                    <option>{pos}</option>
                ))}
            </select>
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Popover
                    anchorElement={createDemoAnchor()}
                    popperElement={createPopper()}
                    popperPlacement={selectedPlacement}
                    showPopper={isTooltipDisplayed}
                    lockFlip
                />
            </div>
        </div>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
