import type { SetupStoriesOptions } from '@lumx/core/stories/types';

export function setup({
    component,
    render,
    decorators: { withCombinations },
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'Default' | 'AllStates';
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component,
            render,
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
            decorators: [
                withCombinations({
                    firstColStyle: { minWidth: '200px' },
                    combinations: {
                        rows: {
                            Default: {},
                            Clickable: { isClickable: true },
                            Selected: { isSelected: true },
                            Disabled: { isDisabled: true },
                            'Clickable & Selected': { isClickable: true, isSelected: true },
                            'Clickable & Disabled': { isClickable: true, isDisabled: true },
                        },
                    },
                }),
            ],
            ...overrides.AllStates,
        },
    };
}
