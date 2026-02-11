import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { mdiAbTesting } from '@lumx/icons';
import { AspectRatio } from '../../constants';
import { Size } from '../../constants';
import { Alignment } from '../../constants';
import { IMAGE_SIZES, imageArgType, IMAGES } from '../../../stories/controls/image';
import { getSelectArgType } from '../../../stories/controls/selectArgType';
import { withUndefined } from '../../../stories/controls/withUndefined';
import { DEFAULT_PROPS, ThumbnailVariant, ThumbnailObjectFit } from '.';

const aligns = [Alignment.center, Alignment.left, Alignment.right];
const variants = [ThumbnailVariant.squared, ThumbnailVariant.rounded];

/**
 * Setup Thumbnail stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
    decorators: { withCombinations, withWrapper, withNestedProps },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withWrapper' | 'withNestedProps';
}>) {
    return {
        meta: {
            component,
            render,
            args: DEFAULT_PROPS,
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
        },

        /** Simple thumbnail taking the size of the original image */
        Simple: {
            args: { image: IMAGES.landscape1s200, alt: 'Landscape image' },
            decorators: [
                withWrapper({
                    style: { border: '1px dashed red', height: 500, width: 500, resize: 'both', overflow: 'hidden' },
                }),
            ],
        },

        /** Loading state */
        IsLoading: {
            args: { image: IMAGES.landscape1s200, alt: 'Loading image', isLoading: true },
        },

        /** Thumbnail without valid source */
        WithoutSource: {
            args: { image: IMAGES.emptyImage, alt: 'Empty image', size: Size.xxl, aspectRatio: AspectRatio.square },
        },

        /** Thumbnail error fallback and size variants */
        ErrorFallback: {
            args: { image: 'foo', alt: 'Broken image' },
            decorators: [
                withCombinations({
                    combinations: {
                        cols: {
                            Default: {},
                            'Icon fallback': { fallback: mdiAbTesting },
                            'Image fallback': { fallback: <img src="/logo.svg" alt="logo" /> },
                        },
                        rows: {
                            Default: {},
                            'Size xl & ratio wide': { size: Size.xl, aspectRatio: AspectRatio.wide },
                            'Size l & ratio vertical': { size: Size.l, aspectRatio: AspectRatio.vertical },
                        },
                    },
                }),
            ],
        },

        /** Simple thumbnail with badge */
        WithBadge: {
            args: {
                image: IMAGES.landscape1s200,
                alt: 'Image with badge',
                size: Size.xl,
            },
        },

        /** Demonstrate the focus point X on a vertical thumbnail containing a horizontal image */
        FocusPointVertical: {
            args: {
                aspectRatio: AspectRatio.vertical,
                size: Size.xxl,
                image: IMAGES.landscape1,
                alt: 'Landscape image with vertical aspect ratio',
                'focusPoint.x': 1,
            },
        },

        /** Demonstrate the focus point Y on a horizontal thumbnail containing a vertical image */
        FocusPointHorizontal: {
            args: {
                aspectRatio: AspectRatio.horizontal,
                size: Size.xxl,
                image: IMAGES.portrait1,
                alt: 'Portrait image with horizontal aspect ratio',
                'focusPoint.y': 1,
            },
        },

        /** Combinations of fillHeight and ratios */
        FillHeightAndRatio: {
            args: { image: IMAGES.landscape1s200, alt: 'Fill height demo', fillHeight: true },
            decorators: [
                withWrapper({
                    style: { border: '1px dashed red', height: 500, width: 500, resize: 'both', overflow: 'hidden' },
                }),
                withCombinations({ combinations: { rows: { key: 'aspectRatio', options: withUndefined(AspectRatio) } } }),
            ],
        },

        /** Simple thumbnail with SVG image */
        WithSvgImages: {
            args: {
                image: IMAGES.defaultSvg,
                alt: 'SVG image',
                size: Size.xxl,
                fillHeight: true,
                'focusPoint.x': 1,
            },
        },

        /** Object fit variants */
        ObjectFit: {
            args: { size: Size.xl, alt: 'Object fit demo' },
            decorators: [
                withCombinations({
                    cellStyle: { border: '1px solid lightgray' },
                    combinations: {
                        cols: {
                            'Default (cover)': {},
                            contain: { objectFit: ThumbnailObjectFit.contain },
                        },
                        rows: {
                            'Ratio square': { aspectRatio: AspectRatio.square },
                            'Ratio wide': { aspectRatio: AspectRatio.wide },
                            'Ratio vertical': { aspectRatio: AspectRatio.vertical },
                        },
                        sections: {
                            'Portrait image': { image: IMAGES.portrait1 },
                            'Landscape image': { image: IMAGES.landscape1 },
                        },
                    },
                }),
            ],
        },
    };
}
