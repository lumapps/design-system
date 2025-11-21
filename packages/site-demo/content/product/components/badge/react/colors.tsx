import { mdiAccount, mdiAlertCircle, mdiCheck, mdiClose, mdiStar } from '@lumx/icons';

import { Badge, ColorPalette, Icon } from '@lumx/react';

export const App = () => (
    <>
        <Badge color={ColorPalette.blue}>
            <Icon icon={mdiStar} />
        </Badge>

        <Badge color={ColorPalette.green}>
            <Icon icon={mdiCheck} />
        </Badge>

        <Badge color={ColorPalette.yellow}>
            <Icon icon={mdiAlertCircle} />
        </Badge>

        <Badge color={ColorPalette.red}>
            <Icon icon={mdiClose} />
        </Badge>

        <Badge color={ColorPalette.dark}>
            <Icon icon={mdiAccount} />
        </Badge>
    </>
);
