import React from 'react';

import { Placement, Popover } from '@lumx/react';

const App = ({ theme }) => {
    const demoAnchorStyle = {
        border: '1px solid grey',
        cursor: 'default',
        fontSize: '12px',
        padding: '5px',
        textAlign: 'center',
        width: '100px',
    };

    const demoPopperStyle = {
        backgroundColor: 'black',
        borderRadius: '3px',
        color: 'white',
        fontSize: '10px',
        padding: '5px',
        width: '130px',
    };

    const demoRandomElementStyle = {
        background: 'repeating-linear-gradient(45deg, #CFCFCF, #CFCFCF 3px, #FFFFFF 3px, #FFFFFF 6px)',
        marginLeft: '3px',
        marginRight: '3px',
    };

    const demoPopoverHolderStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 200,
        justifyContent: 'center',
    };

    const anchorRef = React.useRef(null);
    const popoverRef = React.useRef(null);

    const { computedPosition, isVisible } = Popover.useComputePosition(Placement.RIGHT, anchorRef, popoverRef, true, {
        horizontal: -60,
        vertical: 30,
    });

    return (
        <>
            <div style={demoPopoverHolderStyle}>
                <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{'Random element'}</div>
                <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{'Random element'}</div>

                <div ref={anchorRef} style={demoAnchorStyle}>
                    {'This element will act as the anchor'}
                </div>

                <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{'Random element'}</div>
                <div style={{ ...demoAnchorStyle, ...demoRandomElementStyle }}>{'Random element'}</div>
            </div>

            <Popover theme={theme} popoverRect={computedPosition} popoverRef={popoverRef} isVisible={isVisible}>
                <div style={demoPopperStyle}>{'This element is the popper and is flying above the UI.'}</div>
            </Popover>
        </>
    );
};

export default App;
