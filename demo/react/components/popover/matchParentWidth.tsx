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
    width: '100%',
};

const demoPopoverHolderStyle: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: 200,
    justifyContent: 'space-around',
};

const createDemoAnchor: (width: number) => ReactNode = (width: number): ReactNode => {
    return <div style={{ ...demoAnchorStyle, width }}>{'This element will act as the anchor'}</div>;
};

const createPopper: () => ReactNode = (): ReactNode => {
    return (
        <div style={demoPopperStyle}>
            {
                'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,consequat. '
            }
        </div>
    );
};

/////////////////////////////

/**
 * The demo for the default <Popover>s.
 *
 * @return {React.ReactElement} The demo component.
 */
// tslint:disable: jsx-no-lambda
const DemoComponent: React.FC<IProps> = (): React.ReactElement => {
    // tslint:disable-next-line: typedef
    const [isTooltipDisplayed, setTooltipDisplayed] = useState(false);

    /**
     * Switch tooltip visibility
     * @param {boolean} newVisibleState Tooltip visibility
     */
    const toggleTooltipDisplay: (newVisibleState: boolean) => void = (newVisibleState: boolean): void => {
        setTooltipDisplayed(newVisibleState);
    };

    return (
        <div onMouseOver={(): void => toggleTooltipDisplay(true)} onMouseOut={(): void => toggleTooltipDisplay(false)}>
            <div style={demoPopoverHolderStyle}>
                <Popover
                    anchorElement={createDemoAnchor(230)}
                    popperElement={createPopper()}
                    popperPlacement={Placements.BOTTOM}
                    showPopper={isTooltipDisplayed}
                    lockFlip
                    matchAnchorWidth
                />
            </div>
        </div>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
