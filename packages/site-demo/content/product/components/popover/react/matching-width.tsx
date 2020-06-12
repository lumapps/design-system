import React from 'react';

import { mdiMagnify } from '@lumx/icons';
import { Placement, Popover, TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [searchValue, setSearchValue] = React.useState('');
    const anchorRef = React.useRef(null);

    const demoPopoverHolderStyle = {
        height: 132,
    };

    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 80,
        justifyContent: 'center',
    };

    return (
        <>
            <div style={demoPopoverHolderStyle}>
                <TextField
                    value={searchValue}
                    placeholder="Search"
                    onChange={setSearchValue}
                    icon={mdiMagnify}
                    theme={theme}
                    textFieldRef={anchorRef}
                />
                <Popover theme={theme} anchorRef={anchorRef} placement={Placement.BOTTOM_START}>
                    <div style={demoPopperStyle}>Popover's width matching anchor's</div>
                </Popover>
            </div>
        </>
    );
};

export default App;
