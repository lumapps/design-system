import { AspectRatio, Thumbnail } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.square} image="/demo-assets/landscape2.jpg" />
        </div>

        <div style={{ width: 200 }}>
            <Thumbnail aspectRatio={AspectRatio.original} image="/demo-assets/landscape2.jpg" />
        </div>

        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.vertical} image="/demo-assets/landscape2.jpg" />
        </div>

        <div style={{ width: 150 }}>
            <Thumbnail aspectRatio={AspectRatio.horizontal} image="/demo-assets/landscape2.jpg" />
        </div>
    </>
);
