import { Orientation, Size, UserBlock } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    // tslint:disable-next-line:no-console
    const logAction = (action: string) => () => console.log(action);

    return (
        <UserBlock
            theme={theme}
            name="Emmitt O. Lum"
            fields={['Creative developer', 'Denpasar']}
            avatar="../avatar/assets/persona.png"
            size={Size.l}
            orientation={Orientation.vertical}
            onMouseEnter={logAction('Mouse entered')}
            onMouseLeave={logAction('Mouse left')}
            onClick={logAction('UserBlock clicked')}
        />
    );
};
