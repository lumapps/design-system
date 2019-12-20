import { mdiHeart } from '@lumx/icons';
import { AspectRatio, Icon, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { decorators } from '@lumx/react/story-block';
import { text } from '@storybook/addon-knobs';
import React from 'react';
import { ColorPalette } from '..';
import { Badge } from './Badge';

export default { title: 'Badge', decorators };

export const badgeValue = () => (
    <Badge color={ColorPalette.blue}>
        <span>{text('Value', '30')}</span>
    </Badge>
);

export const badgeIcon = () => (
    <Badge color={ColorPalette.red}>
        <Icon icon={mdiHeart} />
    </Badge>
);
export const badgeThumbnail = () => (
    <Badge color={ColorPalette.dark}>
        <Thumbnail
            aspectRatio={AspectRatio.square}
            image="https://www.lumapps.com/wp-content/uploads/2018/09/brandmark-color-1-150x150.png"
            size={Size.xxs}
            variant={ThumbnailVariant.rounded}
        />
    </Badge>
);
