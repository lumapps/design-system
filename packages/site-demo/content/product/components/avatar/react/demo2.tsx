import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Avatar, FlexBox, IconButton, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <Avatar
        theme={theme}
        image="/demo-assets/persona.png"
        alt="Avatar with actions"
        size="xl"
        actions={
            <FlexBox orientation="horizontal" vAlign="center" gap="regular">
                <IconButton label="Edit" color="dark" emphasis="low" hasBackground icon={mdiPencil} size="s" />
                <IconButton label="See" color="dark" emphasis="low" hasBackground icon={mdiEye} size="s" />
                <IconButton label="Delete" color="dark" emphasis="low" hasBackground icon={mdiDelete} size="s" />
            </FlexBox>
        }
    />
);
