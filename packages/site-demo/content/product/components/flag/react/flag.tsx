import { mdiHeart } from '@lumx/icons';
import { Flag, ColorPalette } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <Flag color={ColorPalette.blue} icon={mdiHeart} label="blue" theme={theme} />
        <Flag color={ColorPalette.dark} icon={mdiHeart} label="dark" theme={theme} />
        <Flag color={ColorPalette.green} icon={mdiHeart} label="green" theme={theme} />
        <Flag color={ColorPalette.red} icon={mdiHeart} label="red" theme={theme} />
        <Flag color={ColorPalette.yellow} icon={mdiHeart} label="yellow" theme={theme} />
    </>
);
