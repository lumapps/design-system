import { AspectRatio, Badge, Size, Thumbnail } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
        <Badge>
            <Thumbnail aspectRatio={AspectRatio.square} image="/logo.svg" size={Size.xxs}/>
        </Badge>
    </>
);

export default App;
