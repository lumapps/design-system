import { Avatar, Badge } from '@lumx/react';

export default () => (
    <>
        <Badge color="red">
            <span>4</span>
        </Badge>

        <Avatar
            image="/demo-assets/persona.png"
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
