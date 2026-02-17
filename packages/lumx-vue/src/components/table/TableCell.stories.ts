import { Table, TableBody, TableCell, TableHeader, TableRow } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Table/TableCellStories';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import TableCellClickableAndSortableVue from './Stories/TableCellClickableAndSortable.vue';

const { meta, ...stories } = setup({
    component: TableCell,
    components: { Table, TableBody, TableHeader, TableRow },
    decorators: { withCombinations },
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
