import { mdiPrinter } from '@lumx/icons';
import { Icon, Tooltip } from '@lumx/react';

export default () => (
    <Tooltip label="Print">
        <Icon icon={mdiPrinter} hasShape />
    </Tooltip>
);
