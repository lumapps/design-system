import { mdiPrinter } from '@lumx/icons';
import { Emphasis, IconButton, Tooltip } from '@lumx/react';
import React from 'react';

export const App = () => (
    <Tooltip delay={2000} label="Print">
        <IconButton emphasis={Emphasis.medium} icon={mdiPrinter} />
    </Tooltip>
);
