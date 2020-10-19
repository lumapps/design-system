import React from 'react';

import { AspectRatio, Badge, Size, Thumbnail } from '@lumx/react';

const App = () => {
    return (
        <div className="demo-grid">
            <Badge>
                <Thumbnail aspectRatio={AspectRatio.square} image="/src/assets/images/logo.svg" size={Size.xxs} />
            </Badge>
        </div>
    );
};

export default App;
