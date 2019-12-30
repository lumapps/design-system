import { mdiHeart } from '@lumx/icons';
import { AspectRatio, Badge, ColorPalette, Icon, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { decorators } from '@lumx/react/story-block';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';

const options = {
    Blue: ColorPalette.blue,
    Dark: ColorPalette.dark,
    Green: ColorPalette.green,
    Light: ColorPalette.light,
    Primary: ColorPalette.primary,
    Red: ColorPalette.red,
    Secondary: ColorPalette.secondary,
    Yellow: ColorPalette.yellow,
};

export default { title: 'Badge', decorators };

export const simpleBadgeWithValue = () => (
    <Badge color={select('Colors', options, ColorPalette.blue)}>
        <span>{text('Value', '30')}</span>
    </Badge>
);

export const simpleBadgeWithIcon = () => (
    <Badge color={select('Colors', options, ColorPalette.red)}>
        <Icon icon={mdiHeart} />
    </Badge>
);
export const simpleBadgeWithThumbnail = () => (
    <Badge color={select('Colors', options, ColorPalette.light)}>
        <Thumbnail
            aspectRatio={AspectRatio.square}
            image="https://www.lumapps.com/wp-content/uploads/2018/09/brandmark-color-1-150x150.png"
            size={Size.xxs}
            variant={ThumbnailVariant.rounded}
        />
    </Badge>
);
