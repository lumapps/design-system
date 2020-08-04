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
            aspectRatio={AspectRatio.square}
            image="https://www.lumapps.com/wp-content/uploads/2018/09/brandmark-color-1-150x150.png"
            size={Size.xxs}
            variant={ThumbnailVariant.rounded}
        />
    </Badge>
);
