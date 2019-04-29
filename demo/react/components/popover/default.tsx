import React, { CSSProperties, ReactNode } from 'react';

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
    fontSize: '10px',
    padding: '5px',
};

const demoRandomElementStyle: CSSProperties = {
    background: `repeating-linear-gradient(
        45deg,
        #CFCFCF,
        #CFCFCF 3px,
        #FFFFFF 3px,
        #FFFFFF 6px
      )`,
    marginLeft: '3px',
    marginRight: '3px',
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
    return <div style={demoPopperStyle}>{`This element is the popper and is flying above the UI.`}</div>;
};

/////////////////////////////

/**
 * The demo for the default <Popover>s.
 *
 * @return {React.ReactElement} The demo component.
 */
// tslint:disable-next-line: typedef
const DemoComponent: React.FC<IProps> = (): React.ReactElement => {
    return (
        <div style={demoPopoverHolderStyle}>
            <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{`Ramdom element`}</div>
            <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{`Ramdom element`}</div>
            <Popover
                anchorElement={createDemoAnchor()}
                popperElement={createPopper()}
                popperPlacement={Placements.RIGHT}
                showPopper
            />
            <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{`Random element`}</div>
            <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{`Random element`}</div>
        </div>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
