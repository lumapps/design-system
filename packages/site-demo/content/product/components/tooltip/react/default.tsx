import { mdiPrinter } from '@lumx/icons';
import { Icon, Tooltip } from '@lumx/react';
import React from 'react';

export const App = () => (
    <Tooltip label="Print">
        <Icon icon={mdiPrinter} />
    </Tooltip>
);
