import React, { useRef } from 'react';

import { Emphasis, IconButton, Placement, Tooltip } from '@lumx/react';

import { mdiPrinter } from '@lumx/icons';

const App = () => {
    const anchorRefDelay = useRef(null);

    return (
        <div className="demo-grid">
            <IconButton buttonRef={anchorRefDelay} emphasis={Emphasis.medium} icon={mdiPrinter} />

            <Tooltip anchorRef={anchorRefDelay} delay={2000} placement={Placement.BOTTOM}>
                Delayed tooltip
            </Tooltip>
        </div>
    );
};

export default App;
