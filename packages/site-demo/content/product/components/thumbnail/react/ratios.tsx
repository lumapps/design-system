import { AspectRatio, Thumbnail } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.square} image="https://picsum.photos/150"/>
        </div>

        <Thumbnail aspectRatio={AspectRatio.original} image="https://picsum.photos/150/80/"/>

        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.vertical} image="https://picsum.photos/150/150"/>
        </div>

        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.horizontal} image="https://picsum.photos/150/150"/>
        </div>
    </>
);

export default App;
