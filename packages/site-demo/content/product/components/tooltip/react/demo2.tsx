import { mdiPrinter } from '@lumx/icons';
import { Icon, Placement, Tooltip } from '@lumx/react';

export default () => (
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
