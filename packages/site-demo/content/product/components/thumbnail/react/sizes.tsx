import { Size, Thumbnail } from '@lumx/react';
import React from 'react';

export const App = () => (
    <>
        <Thumbnail image="/demo-assets/square2.jpg" size={Size.xxs} />
        <Thumbnail image="/demo-assets/square2.jpg" size={Size.xs} />
        <Thumbnail image="/demo-assets/square2.jpg" size={Size.s} />
        <Thumbnail image="/demo-assets/square2.jpg" size={Size.m} />
        <Thumbnail image="/demo-assets/square2.jpg" size={Size.l} />
        <Thumbnail image="/demo-assets/square2.jpg" size={Size.xl} />
        <div style={{ width: 300 }}>
            <Thumbnail image="/demo-assets/square2.jpg" />
        </div>
    </>
);
