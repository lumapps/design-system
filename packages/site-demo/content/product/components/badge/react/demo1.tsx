import { Avatar, Badge } from '@lumx/react';

export default () => (
    <>
        <Badge color="red">
            <span>4</span>
        </Badge>

        <Avatar
            image="https://i.pravatar.cc/128?img=32"
            alt="Avatar with label"
            size="m"
            badge={
                <Badge color="red">
                    <span>4</span>
                </Badge>
            }
        />
    </>
);
