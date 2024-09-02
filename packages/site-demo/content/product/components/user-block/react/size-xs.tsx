import { Size, UserBlock } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <UserBlock
        theme={theme}
        name="Emmitt O. Lum"
        nameProps={{ 'aria-label': 'Emmitt O. Lum - open user profile' }}
        fields={['Creative developer', 'Denpasar']}
        avatarProps={{ image: '/demo-assets/persona.png' }}
        size={Size.xs}
        onClick={console.log}
    />
);
