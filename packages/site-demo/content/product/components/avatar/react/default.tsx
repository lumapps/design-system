import { Avatar, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <>
        <Avatar theme={theme} image="./assets/persona.png" size={Size.xs} />
        <Avatar theme={theme} image="./assets/persona.png" size={Size.s} />
        <Avatar theme={theme} image="./assets/persona.png" size={Size.m} />
        <Avatar theme={theme} image="./assets/persona.png" size={Size.l} />
        <Avatar theme={theme} image="./assets/persona.png" size={Size.xl} />
    </>
);
