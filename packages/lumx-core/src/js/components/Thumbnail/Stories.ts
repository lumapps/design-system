import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { imageArgType, IMAGES } from '@lumx/core/stories/controls/image';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { Alignment, AspectRatio, Size } from '../../constants';
import { ThumbnailVariant } from './types';
import { DEFAULT_PROPS } from '.';

const aligns = [Alignment.center, Alignment.left, Alignment.right];
const variants = [ThumbnailVariant.squared, ThumbnailVariant.rounded];

/**
 * Setup Thumbnail stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 */
export function setup({
    component,
    render,
    decorators: { withNestedProps },
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'Simple' | 'FillHeightAndRatio' | 'ObjectFit';
    decorators: 'withNestedProps';
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                image: imageArgType,
                align: getSelectArgType(aligns),
                variant: getSelectArgType(variants),
                aspectRatio: getSelectArgType(AspectRatio),
                fallback: { control: false },
                'focusPoint.x': { control: { type: 'range', max: 1, min: -1, step: 0.05 } },
                'focusPoint.y': { control: { type: 'range', max: 1, min: -1, step: 0.05 } },
            },
            decorators: [withNestedProps()],
            args: {
                ...DEFAULT_PROPS,
            },
        },

        /** Simple thumbnail taking the size of the original image */
        Simple: {
            ...overrides.Simple,
        },

        /** Loading state */
        IsLoading: {
            args: { image: IMAGES.landscape1s200, isLoading: true },
        },

        WithoutSource: {
            args: { image: IMAGES.emptyImage, size: Size.xxl, aspectRatio: AspectRatio.square },
        },

        /** Demonstrate the focus point X on a vertical thumbnail containing an horizontal image */
        FocusPointVertical: {
            args: {
                aspectRatio: AspectRatio.vertical,
                size: Size.xxl,
                image: IMAGES.landscape1,
                'focusPoint.x': 1,
            },
        },

        /** Demonstrate the focus point Y on a horizontal thumbnail containing an vertical image */
        FocusPointHorizontal: {
            args: {
                aspectRatio: AspectRatio.horizontal,
                size: Size.xxl,
                image: IMAGES.portrait1,
                'focusPoint.y': 1,
            },
        },

        /** Setting `onClick` to turn the thumbnail into a button */
        AsButton: {
            args: { image: IMAGES.landscape1s200 },
            argTypes: { onClick: { action: true } },
        },

        /** Setting `linkProps.href` to turn the thumbnail into a link */
        AsLink: {
            args: { image: IMAGES.landscape1s200, linkProps: { href: 'https://example.com' } },
        },

        /** Combinations of fillHeight and ratios */
        FillHeightAndRatio: {
            ...overrides.FillHeightAndRatio,
        },

        /** Simple thumbnail with svg image */
        WithSvgImages: {
            args: {
                image: IMAGES.defaultSvg,
                size: Size.xxl,
                fillHeight: true,
                'focusPoint.x': 1,
            },
        },

        ObjectFit: {
            ...overrides.ObjectFit,
        },
    };
}
