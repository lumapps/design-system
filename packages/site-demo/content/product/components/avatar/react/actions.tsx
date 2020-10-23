import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Alignment, Avatar, Emphasis, FlexBox, IconButton, Orientation, Size } from '@lumx/react';
import React from 'react';

const App = ({ theme }: any) => (
    <Avatar
        theme={theme}
        image="./assets/persona.png"
        size={Size.xl}
        actions={
            <FlexBox orientation={Orientation.horizontal} vAlign={Alignment.center} gap={Size.regular}>
                <IconButton color="dark" emphasis={Emphasis.low} hasBackground icon={mdiPencil} size={Size.s}/>
                <IconButton color="dark" emphasis={Emphasis.low} hasBackground icon={mdiEye} size={Size.s}/>
                <IconButton color="dark" emphasis={Emphasis.low} hasBackground icon={mdiDelete} size={Size.s}/>
            </FlexBox>
        }
    />
);

export default App;
