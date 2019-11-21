import React from 'react';

import { Size, Thumbnail } from '@lumx/react';

const App = ({ theme }) => (
    <>
        <Thumbnail image="https://picsum.photos/28" size={Size.xxs} theme={theme} />
        <Thumbnail image="https://picsum.photos/40" size={Size.xs} theme={theme} />
        <Thumbnail image="https://picsum.photos/48" size={Size.s} theme={theme} />
        <Thumbnail image="https://picsum.photos/72" size={Size.m} theme={theme} />
        <Thumbnail image="https://picsum.photos/128" size={Size.l} theme={theme} />
        <Thumbnail image="https://picsum.photos/256" size={Size.xl} theme={theme} />
        <div style={{ width: 300 }}>
            <Thumbnail image="https://picsum.photos/400" size={Size.unset} theme={theme} />
        </div>
    </>
);

export default App;
