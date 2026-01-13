import { AspectRatio, Size, SkeletonRectangle, SkeletonRectangleVariant, SkeletonRectangleProps } from '@lumx/react';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { ALL_COLORS, colorArgType } from '@lumx/core/stories/controls/color';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

const variants: SkeletonRectangleProps['variant'][] = [
    SkeletonRectangleVariant.squared,
    SkeletonRectangleVariant.rounded,
    SkeletonRectangleVariant.pill,
];
const sizes: SkeletonRectangleProps['size'][] = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];
const aspectRatios: SkeletonRectangleProps['aspectRatio'][] = [
    AspectRatio.wide,
    AspectRatio.horizontal,
    AspectRatio.square,
    AspectRatio.vertical,
];

export default {
    title: 'LumX components/skeleton/Skeleton Rectangle',
    component: SkeletonRectangle,
    args: SkeletonRectangle.defaultProps,
    argTypes: {
        width: getSelectArgType(sizes),
        height: getSelectArgType(sizes),
        aspectRatio: getSelectArgType(aspectRatios),
        color: colorArgType,
        variant: getSelectArgType(variants),
    },
};

/**
 * All sizes
 */
export const AllSize = {
    argTypes: { width: { control: false }, height: { control: false } },
    decorators: [
        withCombinations({
            // Using same width than height
            combinations: { cols: Object.fromEntries(sizes.map((s) => [s, { height: s, width: s }])) },
        }),
    ],
};

/**
 * All ratios (for a fixed width)
 */
export const AllRatios = {
    args: { width: Size.xl },
    argTypes: { aspectRatio: { control: false } },
    decorators: [
        withCombinations({
            combinations: { cols: { key: 'aspectRatio', options: aspectRatios } },
        }),
    ],
};

/**
 * All variants
 */
export const AllVariants = {
    args: { width: Size.l, height: Size.m },
    argTypes: { variant: { control: false } },
    decorators: [
        withCombinations({
            combinations: { cols: { key: 'variant', options: variants } },
        }),
    ],
};

/**
 * All colors
 */
export const AllColors = {
    args: { width: Size.l, height: Size.m },
    argTypes: { color: { control: false } },
    decorators: [
        withCombinations({
            combinations: { cols: { key: 'color', options: ALL_COLORS } },
        }),
    ],
};
