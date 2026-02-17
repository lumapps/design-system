import { Table, TableBody, TableCell, TableRow } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Table/TableRowStories';

const { meta, ...stories } = setup({
    component: TableRow,
    components: { Table, TableBody, TableCell },
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/table/TableRow',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllStates = { ...stories.AllStates };
