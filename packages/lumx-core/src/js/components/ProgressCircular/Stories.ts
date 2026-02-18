import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { Size } from '../../constants';
import { DEFAULT_PROPS, type ProgressCircularSize } from '.';

const sizes: Array<ProgressCircularSize> = [Size.xxs, Size.xs, Size.s, Size.m];

export function setup({
    component,
    decorators: { withCombinations },
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'Inline';
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component,
            args: DEFAULT_PROPS,
            argTypes: {
                size: getSelectArgType<ProgressCircularSize>(sizes),
            },
        },

        /** Default progress circular */
        Default: {},

        /** All sizes */
        AllSizes: {
            decorators: [
                withCombinations({
                    combinations: { cols: { key: 'size', options: sizes } },
                }),
            ],
        },

        /** Inline display variant to use inside text */
        Inline: {
            ...overrides.Inline,
        },
    };
}
