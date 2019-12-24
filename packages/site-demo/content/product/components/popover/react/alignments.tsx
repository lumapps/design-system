import React from 'react';

import { Chip, Placement, Popover, Size } from '@lumx/react';

const App = ({ theme }) => {
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
    const topStartPopoverRef = React.useRef(null);
    const topStartPosition = Popover.useComputePosition(
        Placement.TOP_START,
        topStartAnchorRef,
        topStartPopoverRef,
        true,
    );

    const topEndAnchorRef = React.useRef(null);
    const topEndPopoverRef = React.useRef(null);
    const topEndPosition = Popover.useComputePosition(Placement.TOP_END, topEndAnchorRef, topEndPopoverRef, true);

    return (
        <div style={demoWrapperStyle}>
            <div style={demoPopoverHolderStyle}>
                <Chip chipRef={topStartAnchorRef} theme={theme} size={Size.s}>
                    TOP_START
                </Chip>
            </div>
            <Popover
                theme={theme}
                popoverRect={topStartPosition.computedPosition}
                popoverRef={topStartPopoverRef}
                isVisible={topStartPosition.isVisible}
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
                popoverRect={topEndPosition.computedPosition}
                popoverRef={topEndPopoverRef}
                isVisible={topEndPosition.isVisible}
            >
                <div style={demoPopperStyle}>{'Popover aligned on start of the top side'}</div>
            </Popover>
        </div>
    );
};

export default App;
