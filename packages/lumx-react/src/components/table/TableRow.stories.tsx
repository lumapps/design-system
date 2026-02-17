import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Table/TableRowStories';
import { Table, TableBody, TableCell, TableRow } from '.';

const { meta, ...stories } = setup({
    component: TableRow,
    render: (args: any) => (
        <Table>
            <TableBody>
                <TableRow {...args}>
                    <TableCell>Cell 1</TableCell>
                    <TableCell>Cell 2</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
    decorators: { withCombinations },
});

export default {
    title: 'Lumx components/table/TableRow',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllStates = { ...stories.AllStates };
