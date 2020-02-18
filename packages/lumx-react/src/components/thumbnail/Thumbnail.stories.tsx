import { AspectRatio, Size, Theme, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { number, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Thumbnail' };

const numberKnobOptions = {
    max: 1,
    min: -1,
    range: true,
    step: 0.1,
};

/**
 * Thumbnail story
 * @return simple Thumbnail.
 */
export const defaultThumbnail = ({ theme }: { theme: Theme }) => {
    const aspectRatio = select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, 'Thumbnail');
    const focusPoint = {
        x: number('Focus X', 0, numberKnobOptions, 'Thumbnail'),
        y: number('Focus Y', 0, numberKnobOptions, 'Thumbnail'),
    };
    const imageUrl = text('Url image', 'https://i.picsum.photos/id/1001/2400/1400.jpg', 'Thumbnail');
    const size = select('Size', [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl], Size.xxl, 'Thumbnail');
    const variant = select<ThumbnailVariant>('Variant', ThumbnailVariant, ThumbnailVariant.squared, 'Thumbnail');

    return (
        <Thumbnail
            aspectRatio={aspectRatio}
            focusPoint={focusPoint}
            image={imageUrl}
            size={size}
            theme={theme}
            variant={variant}
        />
    );
};
