import React from 'react';

import { Badge, ColorPalette, Icon } from '@lumx/react';

import { mdiHeart } from '@lumx/icons';

const App = () => {
    return (
        <Badge color={ColorPalette.red}>
            <Icon icon={mdiHeart} />
        </Badge>
    );
};

export default App;
