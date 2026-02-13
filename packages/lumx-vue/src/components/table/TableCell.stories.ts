import { TableCell, ThOrder } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Table/TableCellStories';
import { mdiAccount } from '@lumx/icons';
import TableCellDefaultVue from './Stories/TableCellDefault.vue';
import TableCellHeaderVue from './Stories/TableCellHeader.vue';

const { meta, ...stories } = setup({
    component: TableCell,
    decorators: { withCombinations },
    overrides: {
        Default: {
            args: {
                children: 'Cell',
            },
            render: withRender({ TableCellDefaultVue }, '{{ args.children }}'),
        },
        Header: {
            args: {
                variant: 'head',
                children: 'Header',
            },
            render: withRender({ TableCellHeaderVue }, '{{ args.children }}'),
        },
        AllHeaderStates: {
            args: {
                variant: 'head',
                children: 'Header',
            },
            render: withRender({ TableCellHeaderVue }, '{{ args.children }}'),
            decorators: [
                withCombinations({
                    firstColStyle: { minWidth: 200 },
                    combinations: {
                        rows: {
                            Default: {},
                            'With icon': { icon: mdiAccount },
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
        },
    },
});

export default {
    title: 'LumX components/table/TableCell',
    ...meta,
};

export const Default = { ...stories.Default };
export const Header = { ...stories.Header };
export const AllHeaderStates = { ...stories.AllHeaderStates };
