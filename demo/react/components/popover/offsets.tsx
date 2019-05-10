import React, { CSSProperties, ReactNode } from 'react';

import { Placements, Popover, PopperOffsets } from 'LumX';

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
    width: '130px',
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
    return <div style={demoPopperStyle}>{`This popper is placed using a 'vertical' and a 'horizontal' offset`}</div>;
};

/////////////////////////////

const offsets: PopperOffsets = { horizontal: -60, vertical: 30 };

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
                popperOffset={offsets}
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
