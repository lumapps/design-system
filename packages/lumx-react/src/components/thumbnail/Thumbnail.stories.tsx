import { AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { select } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Thumbnail' };

/**
 * Thumbnail story
 * @return simple Thumbnail.
 */
export const defaultThumbnail = ({ theme }) => (
    <Thumbnail
        aspectRatio={AspectRatio.square}
        image="https://via.placeholder.com/150/000000/FFFFFF/?text=IPaddress.net"
        size={select(
            'Size',
            {
                XXS: Size.xxs,
                XS: Size.xs,
                S: Size.s,
                M: Size.m,
                L: Size.l,
                XL: Size.xl,
                XXL: Size.xxl,
            },
            Size.m,
            'Options',
        )}
        theme={theme}
        variant={select<ThumbnailVariant>('Variant', ThumbnailVariant, ThumbnailVariant.squared, 'Options')}
    />
);
