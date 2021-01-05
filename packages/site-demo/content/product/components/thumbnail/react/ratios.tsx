import { AspectRatio, Thumbnail } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <div style={{ width: 150 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Square" aspectRatio={AspectRatio.square} />
        </div>

        <div style={{ width: 200 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Original" aspectRatio={AspectRatio.original} />
        </div>

        <div style={{ width: 150 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Vertical" aspectRatio={AspectRatio.vertical} />
        </div>

        <div style={{ width: 150 }}>
            <Thumbnail image="/demo-assets/landscape2.jpg" alt="Horizontal" aspectRatio={AspectRatio.horizontal} />
        </div>
    </>
);
