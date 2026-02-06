import { Emphasis, Size } from '@lumx/core/js/constants';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { ButtonGroup } from './ButtonGroup';

/** Names of all ButtonGroup stories */
export type ButtonGroupStoryName = 'Variants' | 'OneButton' | 'ManyButtons';

/** Options for setting up ButtonGroup stories */
export type SetupButtonGroupStoriesOptions = SetupStoriesOptions<{
    overrides: ButtonGroupStoryName;
    decorators: 'withCombinations';
}>;

/**
 * Setup ButtonGroup stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
    decorators: { withCombinations },
    overrides = {},
}: SetupButtonGroupStoriesOptions) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                children: { control: false },
            },
            args: ButtonGroup.defaultProps,
        },

        /** Size & emphasis variants */
        Variants: {
            decorators: [
                withCombinations({
                    cellStyle: { padding: '10px' },
                    combinations: {
                        rows: { '': { size: Size.m }, 'size=s': { size: Size.s } },
                        cols: { key: 'emphasis', options: [undefined, Emphasis.medium, Emphasis.low] },
                    },
                }),
            ],
            ...overrides.Variants,
        },

        /** ButtonGroup with a single button */
        OneButton: {
            ...overrides.OneButton,
        },

        /** ButtonGroup with many buttons */
        ManyButtons: {
            ...overrides.ManyButtons,
        },
    };
}
