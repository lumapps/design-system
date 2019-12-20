import React from 'react';

import { mdiEmail } from '@lumx/icons';
import { ColorPalette, Icon, Size } from '@lumx/react';

import { decorators } from '@lumx/react/story-block';

export default { title: 'Icon', decorators };

export const allIcon = () => {
    return (
        <>
            <Icon hasShape icon={mdiEmail} color={ColorPalette.yellow} size={Size.s} />
            <Icon hasShape icon={mdiEmail} color={ColorPalette.yellow} />
            <Icon hasShape icon={mdiEmail} size={Size.s} />
            <Icon hasShape icon={mdiEmail} />
            <Icon icon={mdiEmail} color={ColorPalette.yellow} size={Size.s} />
            <Icon icon={mdiEmail} color={ColorPalette.yellow} />
            <Icon icon={mdiEmail} size={Size.s} />
            <Icon icon={mdiEmail} />
        </>
    );
};
