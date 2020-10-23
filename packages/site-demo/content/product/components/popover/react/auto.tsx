import { Chip, Placement, Popover, Size } from '@lumx/react';
import React, { useRef } from 'react';

const App = ({ theme }: any) => {
    const anchorRef = useRef(null);

    return (
        <>
            <Chip style={{ margin: 80 }} chipRef={anchorRef} theme={theme} size={Size.s}>
                Anchor
            </Chip>

            <Popover
                isOpen
                className="lumx-spacing-padding-huge"
                theme={theme}
                anchorRef={anchorRef}
                placement={Placement.AUTO}
            >
                Popover
            </Popover>
        </>
    );
};

export default App;
