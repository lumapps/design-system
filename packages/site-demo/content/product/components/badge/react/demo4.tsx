import { mdiAccount, mdiAlertCircle, mdiCheck, mdiClose, mdiStar } from '@lumx/icons';
import { Badge, Icon } from '@lumx/react';

export default () => (
    <>
        <Badge color="blue">
            <Icon icon={mdiStar} />
        </Badge>

        <Badge color="green">
            <Icon icon={mdiCheck} />
        </Badge>

        <Badge color="yellow">
            <Icon icon={mdiAlertCircle} />
        </Badge>

        <Badge color="red">
            <Icon icon={mdiClose} />
        </Badge>

        <Badge color="dark">
            <Icon icon={mdiAccount} />
        </Badge>
    </>
);
