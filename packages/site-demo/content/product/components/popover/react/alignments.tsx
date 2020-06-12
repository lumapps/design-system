import React from 'react';

import { Chip, Placement, Popover, Size } from '@lumx/react';

const App = ({ theme }: any) => {
    const demoWrapperStyle = {
        display: 'flex',
        justifyContent: 'space-between',
    };

    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 80,
        justifyContent: 'center',
        width: 350,
    };

    const demoPopoverHolderStyle = {
        alignItems: 'flex-end',
        display: 'flex',
        height: 132,
        justifyContent: 'space-around',
    };

    const topStartAnchorRef = React.useRef(null);

    const topEndAnchorRef = React.useRef(null);

    return (
        <div style={demoWrapperStyle}>
            <div style={demoPopoverHolderStyle}>
                <Chip chipRef={topStartAnchorRef} theme={theme} size={Size.s}>
                    TOP_START
                </Chip>
            </div>
            <Popover
                theme={theme}
                anchorRef={topStartAnchorRef}
                placement={Placement.TOP_START}
            >
                <div style={demoPopperStyle}>{'Popover aligned on start of the top side'}</div>
            </Popover>

            <div style={demoPopoverHolderStyle}>
                <Chip chipRef={topEndAnchorRef} theme={theme} size={Size.s}>
                    TOP_END
                </Chip>
            </div>
            <Popover
                theme={theme}
                anchorRef={topEndAnchorRef}
                placement={Placement.TOP_END}
            >
                <div style={demoPopperStyle}>{'Popover aligned on start of the top side'}</div>
            </Popover>
        </div>
    );
};

export default App;
