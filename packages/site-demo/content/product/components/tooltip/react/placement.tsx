import { mdiPrinter } from '@lumx/icons';
import { Icon, Placement, Tooltip } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Tooltip label="Print" placement={Placement.LEFT} forceOpen>
            <Icon hasShape icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.BOTTOM} forceOpen>
            <Icon hasShape icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.TOP} forceOpen>
            <Icon hasShape icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.RIGHT} forceOpen>
            <Icon hasShape icon={mdiPrinter} />
        </Tooltip>
    </>
);
