import React from 'react';
import { text } from '@storybook/addon-knobs';

import { mdiHeart } from '@lumx/icons';
import { ColorPalette, Flag } from '@lumx/react';

export default { title: 'LumX components/flag/Flag' };

export const defaultProps = ({ theme }: any) => <Flag label={text('Label', 'hearing')} theme={theme} />;
export const withIcon = ({ theme }: any) => <Flag icon={mdiHeart} label={text('Label', 'hearing')} theme={theme} />;
export const withColor = ({ theme }: any) => {
    return (
        <>
            <Flag color={ColorPalette.blue} icon={mdiHeart} label="blue" theme={theme} />
            <Flag color={ColorPalette.dark} icon={mdiHeart} label="dark" theme={theme} />
            <Flag color={ColorPalette.green} icon={mdiHeart} label="green" theme={theme} />
            <Flag color={ColorPalette.primary} icon={mdiHeart} label="primary" theme={theme} />
            <Flag color={ColorPalette.red} icon={mdiHeart} label="red" theme={theme} />
            <Flag color={ColorPalette.secondary} icon={mdiHeart} label="secondary" theme={theme} />
            <Flag color={ColorPalette.yellow} icon={mdiHeart} label="yellow" theme={theme} />
        </>
    );
};
