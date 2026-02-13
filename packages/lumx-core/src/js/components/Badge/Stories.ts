import { colorArgType } from '@lumx/core/stories/controls/color';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { ColorPalette } from '../../constants';

import { DEFAULT_PROPS } from '.';

/**
 * Setup Badge stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 */
export function setup({
    component,
    render,
    decorators: { withCombinations },
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'WithIcon';
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                color: colorArgType,
                children: { control: false },
            },
            args: {
                ...DEFAULT_PROPS,
            },
        },

        /** Using badge with text children */
        WithText: {
            args: {
                children: '30',
            },
        },

        /** Using badge with icon children - Icon component provided via overrides */
        WithIcon: {
            ...overrides.WithIcon,
        },

        /** All combinations of colors and children types */
        AllColors: {
            argTypes: {
                color: { control: false },
            },
            decorators: [
                withCombinations({
                    combinations: {
                        cols: {
                            key: 'color',
                            options: withUndefined(ColorPalette),
                        },
                        rows: {
                            'With text': { children: '30' },
                        },
                    },
                }),
            ],
        },
    };
}
