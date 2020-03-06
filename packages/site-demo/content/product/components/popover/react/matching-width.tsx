import React from 'react';

import { mdiMagnify } from '@lumx/icons';
import { Placement, Popover, TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [searchValue, setSearchValue] = React.useState('');
    const anchorRef = React.useRef(null);
    const popoverRef = React.useRef(null);

    const { computedPosition, isVisible } = Popover.useComputePosition(
        Placement.BOTTOM_START,
        anchorRef,
        popoverRef,
        true,
        undefined,
        true,
        true,
    );

    const demoPopoverHolderStyle = {
        height: 132,
    };

    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 80,
        justifyContent: 'center',
        width: computedPosition.width,
    };

    return (
        <div style={demoPopoverHolderStyle}>
            <TextField
                value={searchValue}
                placeholder="Search"
                onChange={setSearchValue}
                icon={mdiMagnify}
                theme={theme}
                textFieldRef={anchorRef}
            />
            <Popover theme={theme} popoverRect={computedPosition} popoverRef={popoverRef} isVisible={isVisible}>
                <div style={demoPopperStyle}>Popover&lsquo;s width matching anchor&lsquo;s</div>
            </Popover>
        </div>
    );
};

export default App;
