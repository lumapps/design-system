import { Size, UserBlock } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    const logAction = (action: string) => () => console.log(action);

    return (
        <UserBlock
            theme={theme}
            name="Emmitt O. Lum"
            fields={['Creative developer', 'Denpasar']}
            avatarProps={{ image: '/demo-assets/persona.png', alt: 'Avatar' }}
            size={Size.l}
            onMouseEnter={logAction('Mouse entered')}
            onMouseLeave={logAction('Mouse left')}
            onClick={logAction('UserBlock clicked')}
        />
    );
};
