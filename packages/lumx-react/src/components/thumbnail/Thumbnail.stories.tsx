import { Alignment, AspectRatio, CrossOrigin, Size, Theme, Thumbnail, ThumbnailVariant } from '@lumx/react';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'LumX components/Thumbnail' };

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
    return (
        <Thumbnail
            align={select<Alignment>('Alignment', Alignment, Alignment.left, 'Options')}
            aspectRatio={select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, 'Options')}
            isCrossOriginEnabled={boolean('Enable CORS', true, 'Options')}
            crossOrigin={select('CORS', CrossOrigin, CrossOrigin.anonymous, 'Options')}
            fillHeight={boolean('Fill Height', false, 'Options')}
            focusPoint={{
                x: number('focusX', 0, numberKnobOptions, 'Options'),
                y: number('focusY', 0, numberKnobOptions, 'Options'),
            }}
            image={text(
                'Url image',
                'https://i.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0',
                'Options',
            )}
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

export const brokenThumbnailWithFallbackProps = ({ theme }: { theme: Theme }) => (
    <Thumbnail
        align={select<Alignment>('Alignment', Alignment, Alignment.left, 'Options')}
        aspectRatio={select<AspectRatio>('Aspect ratio', AspectRatio, AspectRatio.square, 'Options')}
        isCrossOriginEnabled={boolean('Enable CORS', true, 'Options')}
        crossOrigin={select('CORS', CrossOrigin, CrossOrigin.anonymous, 'Options')}
        fillHeight={boolean('Fill Height', false, 'Options')}
        image={text(
            'Url image',
            'https://i.picsum.photos/id/237/536/354.jp?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0',
            'Options',
        )}
        theme={theme}
        variant={select<ThumbnailVariant>('Variant', ThumbnailVariant, ThumbnailVariant.squared, 'Options')}
    />
);
