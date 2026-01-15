import { UserBlock, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <UserBlock
        theme={theme}
        name="Emmitt O. Lum"
        nameProps={{ 'aria-label': 'Emmitt O. Lum - open user profile' }}
        fields={['Creative developer', 'Denpasar']}
        avatarProps={{ image: '/demo-assets/persona.png' }}
        size="s"
        onClick={console.log}
    />
);
