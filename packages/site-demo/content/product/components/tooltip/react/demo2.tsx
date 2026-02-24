import { mdiPrinter } from '@lumx/icons';
import { classNames } from '@lumx/core/js/utils';
import { Icon, Placement, Tooltip } from '@lumx/react';

export default () => (
    <>
        <Tooltip label="Print" placement={Placement.LEFT} forceOpen>
            <Icon className={classNames.margin('all', 'huge')} hasShape icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.BOTTOM} forceOpen>
            <Icon className={classNames.margin('all', 'huge')} hasShape icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.TOP} forceOpen>
            <Icon className={classNames.margin('all', 'huge')} hasShape icon={mdiPrinter} />
        </Tooltip>

        <Tooltip label="Print" placement={Placement.RIGHT} forceOpen>
            <Icon className={classNames.margin('all', 'huge')} hasShape icon={mdiPrinter} />
        </Tooltip>
    </>
);
