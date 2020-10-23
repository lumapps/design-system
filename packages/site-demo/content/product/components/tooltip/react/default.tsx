import { mdiPrinter } from '@lumx/icons';
import { Emphasis, IconButton, Tooltip } from '@lumx/react';
import React from 'react';

const App = () => (
    <Tooltip label="Print">
        <IconButton emphasis={Emphasis.medium} icon={mdiPrinter}/>
    </Tooltip>
);

export default App;
