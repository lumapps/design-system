import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Table/TableCellStories';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '.';
import { TableCellClickableAndSortable as TableCellClickableAndSortableComponent } from './Stories/TableCellClickableAndSortable';

const { meta, ...stories } = setup({
    component: TableCell,
    components: { Table, TableBody, TableHeader, TableRow },
    decorators: { withCombinations },
});

export default {
    title: 'Lumx components/table/TableCell',
    ...meta,
};

export const Default = { ...stories.Default };
export const Header = { ...stories.Header };
export const AllHeaderStates = { ...stories.AllHeaderStates };

/** Interactive example demonstrating clickable and sortable header cells */
export const ClickableAndSortable = {
    render: () => <TableCellClickableAndSortableComponent />,
};
