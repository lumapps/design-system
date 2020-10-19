import React from 'react';

import { Avatar, Badge, ColorPalette, Icon, Size } from '@lumx/react';

import { mdiCheck, mdiClose, mdiHeart, mdiStar } from '@lumx/icons';

const App = () => {
    return (
        <div className="demo-grid">
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
        </div>
    );
};

export default App;
