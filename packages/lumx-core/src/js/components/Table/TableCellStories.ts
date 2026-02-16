import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { TableCellVariant, ThOrder } from './TableCell';

export function setup({
    component,
    decorators: { withCombinations },
    icon,
    overrides = {},
}: SetupStoriesOptions<{
    overrides: 'Default' | 'Header' | 'AllHeaderStates';
    decorators: 'withCombinations';
}> & { icon: string }) {
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
            args: {
                children: 'Cell',
            },
            ...overrides.Default,
        },

        /** Header cell */
        Header: {
            args: {
                variant: 'head',
                children: 'Header',
            },
            ...overrides.Header,
        },

        /** Combination of all header cell states */
        AllHeaderStates: {
            args: {
                variant: 'head',
                children: 'Header',
            },
            decorators: [
                withCombinations({
                    firstColStyle: { minWidth: 200 },
                    combinations: {
                        rows: {
                            Default: {},
                            'With icon': { icon },
                            Sortable: { isSortable: true },
                            'Sortable asc': {
                                isSortable: true,
                                sortOrder: ThOrder.asc,
                            },
                            'Sortable desc': {
                                isSortable: true,
                                sortOrder: ThOrder.desc,
                            },
                        },
                    },
                }),
            ],
            ...overrides.AllHeaderStates,
        },
    };
}
