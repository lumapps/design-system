import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { Size } from '../../constants';
import { ALL_COLORS } from '../../../stories/controls/color';
import { DEFAULT_PROPS } from './SkeletonCircle';
import type { SkeletonCircleProps } from './SkeletonCircle';

const sizes: SkeletonCircleProps['size'][] = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

/**
 * Setup SkeletonCircle stories for a specific framework (React or Vue).
 */
export function setup({
    component: SkeletonCircle,
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
}>) {
    const meta = {
        component: SkeletonCircle,
        render: (args: any) => <SkeletonCircle {...args} />,
        argTypes: {
            size: {
                control: 'select',
                options: sizes,
            },
            color: {
                control: 'select',
                options: ALL_COLORS,
            },
        },
        args: DEFAULT_PROPS,
    };

    /** All sizes */
    const AllSize = {
        argTypes: { size: { control: false } },
        decorators: [
            withCombinations({
                combinations: { cols: { key: 'size', options: sizes } },
            }),
        ],
    };

    /** All colors */
    const AllColor = {
        args: { size: Size.m },
        argTypes: { color: { control: false } },
        decorators: [
            withCombinations({
                combinations: { cols: { key: 'color', options: ALL_COLORS } },
            }),
        ],
    };

    return { meta, AllSize, AllColor };
}
