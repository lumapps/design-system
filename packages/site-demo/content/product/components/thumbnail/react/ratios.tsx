import React from 'react';

import { Thumbnail, AspectRatio } from '@lumx/react';

const App = ({ theme }) => (
    <>
        <Thumbnail aspectRatio={AspectRatio.square} image="https://picsum.photos/150" theme={theme} />
        <Thumbnail aspectRatio={AspectRatio.original} image="https://picsum.photos/150/80/" theme={theme} />
        <Thumbnail aspectRatio={AspectRatio.vertical} image="https://picsum.photos/150/150" theme={theme} />
        <Thumbnail aspectRatio={AspectRatio.horizontal} image="https://picsum.photos/150/150" theme={theme} />
    </>
);

export default App;
