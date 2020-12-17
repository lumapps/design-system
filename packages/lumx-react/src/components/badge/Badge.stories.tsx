import { mdiHeart } from '@lumx/icons';
import { AspectRatio, Badge, ColorPalette, Icon, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/badge/Badge' };

export const simpleBadgeWithValue = () => (
    <Badge color={select('Colors', ColorPalette, ColorPalette.blue)}>
        <span>{text('Value', '30')}</span>
    </Badge>
);

export const simpleBadgeWithIcon = () => (
    <Badge color={select('Colors', ColorPalette, ColorPalette.red)}>
        <Icon icon={mdiHeart} />
    </Badge>
);

export const simpleBadgeWithThumbnail = () => (
    <Badge color={select('Colors', ColorPalette, ColorPalette.light)}>
        <Thumbnail
            alt="Logo"
            aspectRatio={AspectRatio.square}
            image="/logo.svg"
            size={Size.xxs}
            variant={ThumbnailVariant.rounded}
        />
    </Badge>
);
