import { Alignment, AspectRatio, CrossOrigin, Size, Theme, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/Thumbnail' };

const numberKnobOtions = {
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
    return (
        <Thumbnail
            align={select<Alignment>('Alignment', Alignment, Alignment.left, 'Options')}
            aspectRatio={select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, 'Options')}
            enableCrossOrigin={boolean('Enable CORS', true, 'Options')}
            crossOrigin={select('CORS', CrossOrigin, CrossOrigin.anonymous, 'Options')}
            fillHeight={boolean('Fill Height', false, 'Options')}
            focusPoint={{
                x: number('focusX', 0, numberKnobOtions, 'Options'),
                y: number('focusY', 0, numberKnobOtions, 'Options'),
            }}
            image={text('Url image', 'https://i.picsum.photos/id/1001/2400/1400.jpg', 'Options')}
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
            isFollowingWindowSize={boolean('Update on window resize', true, 'Options')}
            resizeDebounceTime={number('Debounce time after resize', 20, undefined, 'Options')}
            variant={select<ThumbnailVariant>('Variant', ThumbnailVariant, ThumbnailVariant.squared, 'Options')}
        />
    );
};
