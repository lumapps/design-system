import React, { CSSProperties, ReactElement, useRef } from 'react';

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

/////////////////////////////

/**
 * The demo for the default <Popover>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): ReactElement => {
    const anchorRef = useRef(null);

    return (
        <>
            <div style={demoPopoverHolderStyle}>
                <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{'Ramdom element'}</div>
                <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{'Ramdom element'}</div>
                <div ref={anchorRef} style={demoAnchorStyle}>
                    {'This element will act as the anchor'}
                </div>
                <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{'Random element'}</div>
                <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{'Random element'}</div>
            </div>
            <Popover anchorRef={anchorRef} isVisible={true} placement={Placement.RIGHT}>
                <div style={demoPopperStyle}>{'This element is the popper and is flying above the UI.'}</div>
            </Popover>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
