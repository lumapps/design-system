import React from 'react';

import { Alignment, FlexBox, Orientation, Size, Thumbnail } from '@lumx/react';

const App = () => (
    <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center} vAlign={Alignment.center} gap={Size.big}>
        <Thumbnail image="https://picsum.photos/28" size={Size.xxs} />
        <Thumbnail image="https://picsum.photos/40" size={Size.xs} />
        <Thumbnail image="https://picsum.photos/48" size={Size.s} />
        <Thumbnail image="https://picsum.photos/72" size={Size.m} />
        <Thumbnail image="https://picsum.photos/128" size={Size.l} />
        <Thumbnail image="https://picsum.photos/256" size={Size.xl} />

        <div style={{ width: 300 }}>
            <Thumbnail image="https://picsum.photos/400" />
        </div>
    </FlexBox>
);

export default App;
