import React from 'react';

import { Placements, Popover, PopperOffsets } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
}
const demoAnchorStyle: React.CSSProperties = {
    border: '1px solid grey',
    cursor: 'default',
    fontSize: '12px',
    padding: '5px',
    textAlign: 'center',
    width: '100px',
};

const demoPopperStyle: React.CSSProperties = {
    backgroundColor: 'black',
    borderRadius: '3px',
    color: 'white',
    fontSize: '10px',
    padding: '5px',
    width: '130px',
};

const demoRandomElementStyle: React.CSSProperties = {
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

function createDemoAnchor(): React.ReactNode {
    return <div style={demoAnchorStyle}>{`This element will act as the anchor`}</div>;
}

function createPopper(): React.ReactNode {
    return <div style={demoPopperStyle}>{`This popper is placed using a 'vertical' and a 'horizontal' offset`}</div>;
}

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
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
