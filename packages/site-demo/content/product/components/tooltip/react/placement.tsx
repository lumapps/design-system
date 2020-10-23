import { mdiPrinter } from '@lumx/icons';
import { Emphasis, IconButton, Placement, Tooltip } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
        <Tooltip label="Print" placement={Placement.LEFT} forceOpen>
            <IconButton emphasis={Emphasis.medium} icon={mdiPrinter}/>
        </Tooltip>

        <Tooltip label="Print" placement={Placement.BOTTOM} forceOpen>
            <IconButton emphasis={Emphasis.medium} icon={mdiPrinter}/>
        </Tooltip>

        <Tooltip label="Print" placement={Placement.TOP} forceOpen>
            <IconButton emphasis={Emphasis.medium} icon={mdiPrinter}/>
        </Tooltip>

        <Tooltip label="Print" placement={Placement.RIGHT} forceOpen>
            <IconButton emphasis={Emphasis.medium} icon={mdiPrinter}/>
        </Tooltip>
    </>
);

export default App;
