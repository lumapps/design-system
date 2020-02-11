import { Alignment, AspectRatio, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { boolean, number, select } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Thumbnail' };

const numberKnobOtions = {
    range: true,
    min: -1,
    max: 1,
    step: 0.1,
};

/**
 * Thumbnail story
 * @return simple Thumbnail.
 */
export const defaultThumbnail = ({ theme }) => (
    <Thumbnail
        align={select<Alignment>('Alignment', Alignment, Alignment.left, 'Options')}
        aspectRatio={select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, 'Options')}
        fillHeight={boolean('Fill height', false, 'Options')}
        focus={{
            x: number('focusX', 0, numberKnobOtions, 'Options'),
            y: number('focusY', 0, numberKnobOtions, 'Options'),
        }}
        image="https://i.picsum.photos/id/1001/2400/1400.jpg"
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
            Size.xxl,
            'Options',
        )}
        theme={theme}
        variant={select<ThumbnailVariant>('Variant', ThumbnailVariant, ThumbnailVariant.squared, 'Options')}
    />
);
