import React, { CSSProperties, ReactNode, useState } from 'react';

import { Button, ButtonEmphasises, ButtonSizes, Placements, Popover } from 'LumX';

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
    fontSize: '10px',
    padding: '5px',
    width: '123px',
};

const demoPopoverHolderStyle: CSSProperties = {
    alignItems: 'center',
    display: 'flex',
    height: 200,
    justifyContent: 'center',
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
    const [isTooltipDisplayed, setTooltipDisplayed] = useState(false);

    /**
     * Switch tooltip visibility
     */
    const toggleTooltipDisplay: (evt?: React.MouseEvent<HTMLElement>) => void = (): void => {
        setTooltipDisplayed(!isTooltipDisplayed);
    };

    return (
        <div>
            <Button size={ButtonSizes.s} emphasis={ButtonEmphasises.medium} onClick={toggleTooltipDisplay}>
                Toggle visibility
            </Button>
            <div style={demoPopoverHolderStyle}>
                <Popover
                    anchorElement={createDemoAnchor()}
                    popperElement={createPopper()}
                    popperPlacement={Placements.AUTO}
                    showPopper={isTooltipDisplayed}
                />
            </div>
        </div>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
