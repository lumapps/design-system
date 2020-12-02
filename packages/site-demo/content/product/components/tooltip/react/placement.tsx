import { mdiPrinter } from '@lumx/icons';
import { Icon, Placement, Tooltip } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Tooltip label="Print" placement={Placement.LEFT} forceOpen>
            <Icon icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.BOTTOM} forceOpen>
            <Icon icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.TOP} forceOpen>
            <Icon icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.RIGHT} forceOpen>
            <Icon icon={mdiPrinter} />
        </Tooltip>
    </>
);
