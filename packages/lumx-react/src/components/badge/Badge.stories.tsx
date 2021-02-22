import { mdiHeart } from '@lumx/icons';
import { AspectRatio, Badge, ColorPalette, Icon, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { select, text } from '@storybook/addon-knobs';
import React, { Fragment } from 'react';

export default { title: 'LumX components/badge/Badge' };

export const WithText = () => (
    <Badge color={select('Colors', ColorPalette, ColorPalette.blue)}>
        <span>{text('Value', '30')}</span>
    </Badge>
);

export const WithIcon = () => (
    <Badge color={select('Colors', ColorPalette, ColorPalette.red)}>
        <Icon icon={mdiHeart} />
    </Badge>
);

export const WithThumbnail = () => (
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

export const AllColors = () => (
    <dl>
        {Object.values(ColorPalette).map((color) => (
            <Fragment key={color}>
                <dt>{color}</dt>
                <dd>
                    <Badge color={color}>
                        <Icon icon={mdiHeart} />
                    </Badge>
                </dd>
            </Fragment>
        ))}
    </dl>
);
