import React, { useRef } from 'react';

import { Emphasis, IconButton, Placement, Tooltip } from '@lumx/react';

import { mdiPrinter } from '@lumx/icons';

const App = () => {
    const anchorRefBottom = useRef(null);

    return (
        <div className="demo-grid">
            <IconButton buttonRef={anchorRefBottom} emphasis={Emphasis.medium} icon={mdiPrinter} />

            <Tooltip anchorRef={anchorRefBottom} placement={Placement.BOTTOM}>
                Print
            </Tooltip>
        </div>
    );
};

export default App;
