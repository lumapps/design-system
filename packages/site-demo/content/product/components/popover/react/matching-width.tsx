import React, { useRef } from 'react';

import { mdiMagnify } from '@lumx/icons';
import { Placement, Popover, TextField } from '@lumx/react';

export const App = ({ theme }: any) => {
    const [searchValue, setSearchValue] = React.useState('');
    const anchorRef = useRef(null);

    return (
        <>
            <div style={{ marginBottom: 80 }}>
                <TextField
                    placeholder="Search"
                    value={searchValue}
                    onChange={setSearchValue}
                    icon={mdiMagnify}
                    theme={theme}
                    textFieldRef={anchorRef}
                />
            </div>
            <Popover
                isOpen
                className="lumx-spacing-padding-huge"
                theme={theme}
                anchorRef={anchorRef}
                placement={Placement.BOTTOM_START}
                fitToAnchorWidth
            >
                Popover&apos;s width matching anchor&apos;s
            </Popover>
        </>
    );
};
