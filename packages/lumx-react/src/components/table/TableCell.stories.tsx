import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { mdiAccount } from '@lumx/icons';

import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { Table, TableBody, TableCell, TableCellVariant, TableHeader, TableRow, ThOrder } from '.';

export default {
    title: 'Lumx components/table/TableCell',
    component: TableCell,
    argTypes: {
        variant: getSelectArgType(TableCellVariant),
        onHeaderClick: { action: true },
    },
};

/** Simple body cell */
export const Default = {
    args: {
        children: 'Cell',
    },
    render: (args: any) => (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell {...args} />
                </TableRow>
            </TableBody>
        </Table>
    ),
};

/** Header cell */
export const Header = {
    args: {
        variant: TableCellVariant.head,
        children: 'Header',
    },
    render: (args: any) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell {...args} />
                </TableRow>
            </TableHeader>
        </Table>
    ),
};

/** Combination of all header cell states */
export const AllHeaderStates = {
    ...Header,
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
};
