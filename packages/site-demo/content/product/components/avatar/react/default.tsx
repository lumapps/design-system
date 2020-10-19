import React from 'react';

import { Avatar, Size } from '@lumx/react';

const App = ({ theme }: any) => (
    <div className="demo-grid">
        <Avatar theme={theme} image="./assets/persona.png" size={Size.xs} />
        <Avatar theme={theme} image="./assets/persona.png" size={Size.s} />
        <Avatar theme={theme} image="./assets/persona.png" size={Size.m} />
        <Avatar theme={theme} image="./assets/persona.png" size={Size.l} />
        <Avatar theme={theme} image="./assets/persona.png" size={Size.xl} />
    </div>
);

export default App;
