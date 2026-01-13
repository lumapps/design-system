import { Size, SkeletonCircle, SkeletonCircleProps } from '@lumx/react';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { ALL_COLORS, colorArgType } from '@lumx/core/stories/controls/color';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

const sizes: SkeletonCircleProps['size'][] = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export default {
    title: 'LumX components/skeleton/Skeleton Circle',
    component: SkeletonCircle,
    args: SkeletonCircle.defaultProps,
    argTypes: {
        size: getSelectArgType(sizes),
        color: colorArgType,
    },
};

/**
 * All sizes
 */
export const AllSize = {
    argTypes: { size: { control: false } },
    decorators: [
        withCombinations({
            combinations: { cols: { key: 'size', options: sizes } },
        }),
    ],
};

/**
 * All colors
 */
export const AllColor = {
    args: { size: Size.m },
    argTypes: { color: { control: false } },
    decorators: [
        withCombinations({
            combinations: { cols: { key: 'color', options: ALL_COLORS } },
        }),
    ],
};
