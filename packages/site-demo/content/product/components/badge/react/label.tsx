import { Avatar, Badge, ColorPalette, Size } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Badge color={ColorPalette.red}>
            <span>4</span>
        </Badge>

        <Avatar
            image="/demo-assets/persona.png"
            alt="Avatar with label"
            size={Size.m}
            badge={
                <Badge color={ColorPalette.red}>
                    <span>4</span>
                </Badge>
            }
        />
    </>
);
