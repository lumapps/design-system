import type { SetupStoriesOptions } from '@lumx/core/stories/types';

export function setup({
    component,
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'Default' | 'AllStates';
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component,
            argTypes: {
                children: { control: false },
            },
        },

        /** Simple table row */
        Default: {
            ...overrides.Default,
        },

        /** Combination of all states */
        AllStates: {
            ...overrides.AllStates,
        },
    };
}
