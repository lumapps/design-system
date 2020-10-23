import { mdiCheck, mdiClose, mdiHeart, mdiStar } from '@lumx/icons';

import { Avatar, Badge, ColorPalette, Icon, Size } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Badge color={ColorPalette.green}>
            <Icon icon={mdiCheck} />
        </Badge>

        <Badge color={ColorPalette.red}>
            <Icon icon={mdiClose} />
        </Badge>

        <Avatar
            image="../avatar/assets/persona.png"
            size={Size.m}
            badge={
                <Badge color={ColorPalette.yellow}>
                    <Icon icon={mdiStar} />
                </Badge>
            }
        />

        <Avatar
            image="../avatar/assets/persona.png"
            size={Size.m}
            badge={
                <Badge color={ColorPalette.red}>
                    <Icon icon={mdiHeart} />
                </Badge>
            }
        />
    </>
);
