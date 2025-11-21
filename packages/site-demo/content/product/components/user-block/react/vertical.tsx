import { Orientation, Size, UserBlock } from '@lumx/react';

export const App = ({ theme }: any) => (
    <UserBlock
        theme={theme}
        name="Emmitt O. Lum"
        nameProps={{ 'aria-label': 'Emmitt O. Lum - open user profile' }}
        fields={['Creative developer', 'Denpasar']}
        avatarProps={{ image: '/demo-assets/persona.png' }}
        size={Size.l}
        orientation={Orientation.vertical}
        onClick={console.log}
    />
);
