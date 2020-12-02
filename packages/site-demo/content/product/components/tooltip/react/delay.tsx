import { mdiPrinter } from '@lumx/icons';
import { Icon, Tooltip } from '@lumx/react';
import React from 'react';

export const App = () => (
    <Tooltip delay={2000} label="Print">
        <Icon icon={mdiPrinter} />
    </Tooltip>
);
