import React from 'react';

import { mdiEmail } from '@lumx/icons';
import { ColorPalette, Icon, Size } from '@lumx/react';

import { decorators } from '@lumx/react/story-block';

export default { title: 'Icon', decorators };

export const allIcon = ({ theme }) => {
    return (
        <>
            <Icon hasShape icon={mdiEmail} color={ColorPalette.yellow} size={Size.s} theme={theme} />
            <Icon hasShape icon={mdiEmail} color={ColorPalette.yellow} theme={theme} />
            <Icon hasShape icon={mdiEmail} size={Size.s} theme={theme} />
            <Icon hasShape icon={mdiEmail} theme={theme} />
            <Icon icon={mdiEmail} color={ColorPalette.yellow} size={Size.s} theme={theme} />
            <Icon icon={mdiEmail} color={ColorPalette.yellow} theme={theme} />
            <Icon icon={mdiEmail} size={Size.s} theme={theme} />
            <Icon icon={mdiEmail} theme={theme} />
        </>
    );
};
