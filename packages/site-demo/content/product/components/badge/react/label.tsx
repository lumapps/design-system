import { Avatar, Badge, ColorPalette, Size } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
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
    </>
);

export default App;
