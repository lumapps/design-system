import React from 'react';

import { Thumbnail, ThumbnailVariant } from '@lumx/react';

const App = ({ theme }) => (
    <>
        <Thumbnail image="https://picsum.photos/150" theme={theme} variant={ThumbnailVariant.squared} />
        <Thumbnail image="https://picsum.photos/150" theme={theme} variant={ThumbnailVariant.rounded} />
    </>
);

export default App;
