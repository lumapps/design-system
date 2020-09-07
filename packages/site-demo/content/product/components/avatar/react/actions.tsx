import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Alignment, Avatar, Emphasis, FlexBox, IconButton, Orientation, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <Avatar
        theme={theme}
        image="/demo-assets/persona.png"
        size={Size.xl}
        actions={
            <FlexBox orientation={Orientation.horizontal} vAlign={Alignment.center} gap={Size.regular}>
                <IconButton color="dark" emphasis={Emphasis.low} hasBackground icon={mdiPencil} size={Size.s} />
                <IconButton color="dark" emphasis={Emphasis.low} hasBackground icon={mdiEye} size={Size.s} />
                <IconButton color="dark" emphasis={Emphasis.low} hasBackground icon={mdiDelete} size={Size.s} />
            </FlexBox>
        }
    />
);
