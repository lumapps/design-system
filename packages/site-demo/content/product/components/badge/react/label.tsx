import React from 'react';

import { Avatar, Badge, ColorPalette, Size } from '@lumx/react';

const App = () => {
    return (
        <div className="demo-grid">
            <Badge color={ColorPalette.red}>
                <span>4</span>
            </Badge>

            <Avatar
                image="../avatar/assets/persona.png"
                size={Size.m}
                badge={
                    <Badge color={ColorPalette.red}>
                        <span>4</span>
                    </Badge>
                }
            />
        </div>
    );
};

export default App;
