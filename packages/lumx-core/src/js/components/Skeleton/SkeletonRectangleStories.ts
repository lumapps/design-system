import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { AspectRatio, Size } from '../../constants';
import { ALL_COLORS } from '../../../stories/controls/color';
import { DEFAULT_PROPS, SkeletonRectangleVariant } from './SkeletonRectangle';
import type { SkeletonRectangleProps } from './SkeletonRectangle';

const variants: SkeletonRectangleProps['variant'][] = [
    SkeletonRectangleVariant.squared,
    SkeletonRectangleVariant.rounded,
    SkeletonRectangleVariant.pill,
];
const sizes: SkeletonRectangleProps['width'][] = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];
const aspectRatios: SkeletonRectangleProps['aspectRatio'][] = [
    AspectRatio.wide,
    AspectRatio.horizontal,
    AspectRatio.square,
    AspectRatio.vertical,
];

/**
 * Setup SkeletonRectangle stories for a specific framework (React or Vue).
 */
export function setup({
    component,
    render,
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                width: {
                    control: 'select',
                    options: sizes,
                },
                height: {
                    control: 'select',
                    options: sizes,
                },
                aspectRatio: {
                    control: 'select',
                    options: aspectRatios,
                },
                color: {
                    control: 'select',
                    options: ALL_COLORS,
                },
                variant: {
                    control: 'select',
                    options: variants,
                },
            },
            args: DEFAULT_PROPS,
        },

        /** All sizes */
        AllSize: {
            argTypes: { width: { control: false }, height: { control: false } },
            decorators: [
                withCombinations({
                    // Using same width than height
                    combinations: { cols: Object.fromEntries(sizes.map((s) => [s, { height: s, width: s }])) },
                }),
            ],
        },

        /** All ratios (for a fixed width) */
        AllRatios: {
            args: { width: Size.xl },
            argTypes: { aspectRatio: { control: false } },
            decorators: [
                withCombinations({
                    combinations: { cols: { key: 'aspectRatio', options: aspectRatios } },
                }),
            ],
        },

        /** All variants */
        AllVariants: {
            args: { width: Size.l, height: Size.m },
            argTypes: { variant: { control: false } },
            decorators: [
                withCombinations({
                    combinations: { cols: { key: 'variant', options: variants } },
                }),
            ],
        },

        /** All colors */
        AllColors: {
            args: { width: Size.l, height: Size.m },
            argTypes: { color: { control: false } },
            decorators: [
                withCombinations({
                    combinations: { cols: { key: 'color', options: ALL_COLORS } },
                }),
            ],
        },
    };
}
