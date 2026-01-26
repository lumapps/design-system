import { mdiCheck, mdiClose, mdiHeart, mdiStar } from '@lumx/icons';
import { Avatar, Badge, Icon } from '@lumx/react';

export default () => (
    <>
        <Badge color="green">
            <Icon icon={mdiCheck} />
        </Badge>

        <Badge color="red">
            <Icon icon={mdiClose} />
        </Badge>

        <Avatar
            image="https://i.pravatar.cc/128?img=32"
            alt="Avatar with icon"
            size="m"
            badge={
                <Badge color="yellow">
                    <Icon icon={mdiStar} />
                </Badge>
            }
        />

        <Avatar
            image="https://i.pravatar.cc/128?img=32"
            alt="Avatar with icon"
            size="m"
            badge={
                <Badge color="red">
                    <Icon icon={mdiHeart} />
                </Badge>
            }
        />
    </>
);
