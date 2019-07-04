import React, { CSSProperties, ReactElement, useState } from 'react';

import { Popover, PopperPlacement } from 'LumX';

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

const createDemoAnchor = (): ReactElement => {
    return <div style={demoAnchorStyle}>{`This element will act as the anchor`}</div>;
};

const createPopper = (): ReactElement => {
    return (
        <div style={demoPopperStyle}>
            {`Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consequat. `}
        </div>
    );
};

/**
 * The demo for the default <Popover>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): ReactElement => {
    const [selectedPlacement, setSelectedPlacement] = useState(PopperPlacement.AUTO);
    const [isTooltipDisplayed, setTooltipDisplayed] = useState(false);
    const availablePopperPlacement: string[] = [
        PopperPlacement.AUTO,
        PopperPlacement.AUTO_END,
        PopperPlacement.AUTO_START,
        PopperPlacement.BOTTOM,
        PopperPlacement.BOTTOM_END,
        PopperPlacement.BOTTOM_START,
        PopperPlacement.LEFT,
        PopperPlacement.LEFT_END,
        PopperPlacement.LEFT_START,
        PopperPlacement.RIGHT,
        PopperPlacement.RIGHT_END,
        PopperPlacement.RIGHT_START,
        PopperPlacement.TOP,
        PopperPlacement.TOP_END,
        PopperPlacement.TOP_START,
    ];

    function toggleTooltipDisplay(newVisibleState: boolean): void {
        setTooltipDisplayed(newVisibleState);
    }

    return (
        <div onMouseOver={(): void => toggleTooltipDisplay(true)} onMouseOut={(): void => toggleTooltipDisplay(false)}>
            <select
                onChange={(evt: React.ChangeEvent<HTMLSelectElement>): void =>
                    setSelectedPlacement(evt.target.value as PopperPlacement)
                }
            >
                {availablePopperPlacement.map((pos: string) => (
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
