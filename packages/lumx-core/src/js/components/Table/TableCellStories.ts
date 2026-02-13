import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { TableCellVariant } from './TableCell';

export function setup({
    component,
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'Default' | 'Header' | 'AllHeaderStates';
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component,
            argTypes: {
                variant: getSelectArgType(TableCellVariant),
                onHeaderClick: { action: true },
            },
        },

        /** Simple body cell */
        Default: {
            ...overrides.Default,
        },

        /** Header cell */
        Header: {
            ...overrides.Header,
        },

        /** Combination of all header cell states */
        AllHeaderStates: {
            ...overrides.AllHeaderStates,
        },
    };
}
