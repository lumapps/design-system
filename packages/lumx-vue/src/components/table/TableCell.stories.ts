import { TableCell } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Table/TableCellStories';
import { mdiAccount } from '@lumx/icons';
import TableCellDefaultVue from './Stories/TableCellDefault.vue';
import TableCellHeaderVue from './Stories/TableCellHeader.vue';
import TableCellClickableAndSortableVue from './Stories/TableCellClickableAndSortable.vue';

const { meta, ...stories } = setup({
    component: TableCell,
    decorators: { withCombinations },
    icon: mdiAccount,
    overrides: {
        Default: {
            render: withRender({ TableCellDefaultVue }, '{{ args.children }}'),
        },
        Header: {
            render: withRender({ TableCellHeaderVue }, '{{ args.children }}'),
        },
        AllHeaderStates: {
            render: withRender({ TableCellHeaderVue }, '{{ args.children }}'),
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

/** Interactive example demonstrating clickable and sortable header cells */
export const ClickableAndSortable = {
    render: withRender({ TableCellClickableAndSortableVue }),
};
