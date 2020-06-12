import React from 'react';

import { Chip, Placement, Popover, Size } from '@lumx/react';

const App = ({ theme }: any) => {
    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 100,
        justifyContent: 'center',
        width: 200,
    };

    const demoPopoverHolderStyle = {
        alignItems: 'start',
        display: 'flex',
        height: 132,
        justifyContent: 'center',
    };

    const anchorRef = React.useRef(null);

    return (
        <>
            <div style={demoPopoverHolderStyle}>
                <Chip chipRef={anchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={anchorRef} placement={Placement.BOTTOM}>
                <div style={demoPopperStyle}>{'Popover'}</div>
            </Popover>
        </>
    );
};

export default App;
