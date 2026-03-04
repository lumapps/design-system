import { UserBlock, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <UserBlock
        theme={theme}
        name="Emmitt O. Lum"
        nameProps={{ 'aria-label': 'Emmitt O. Lum - open user profile' }}
        fields={['Creative developer', 'Denpasar']}
        avatarProps={{ image: 'https://i.pravatar.cc/128?img=32' }}
        size="l"
        onClick={console.log}
    />
);
