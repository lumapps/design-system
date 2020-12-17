import { AspectRatio, Badge, Size, Thumbnail } from '@lumx/react';
import React from 'react';

export const App = () => (
    <Badge>
        <Thumbnail alt="Logo" aspectRatio={AspectRatio.square} image="/logo.svg" size={Size.xxs} />
    </Badge>
);
