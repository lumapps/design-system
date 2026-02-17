import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { mdiAccount } from '@lumx/icons';
import { TableCellVariant, ThOrder } from './TableCell';

export function setup({
    component: TableCell,
    components: { Table, TableBody, TableHeader, TableRow },
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
    components: { Table: any; TableBody: any; TableHeader: any; TableRow: any };
}>) {
    const meta = {
        component: TableCell,
        argTypes: {
            variant: getSelectArgType(TableCellVariant),
            onHeaderClick: { action: true },
        },
    };

    /** Simple body cell */
    const Default = {
        args: { children: 'Cell' },
        render: ({ children, ...args }: any) => (
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell {...args}>{children}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        ),
    };

    /** Header cell */
    const Header = {
        args: { variant: 'head', children: 'Header' },
        render: ({ children, ...args }: any) => (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell {...args}>{children}</TableCell>
                    </TableRow>
                </TableHeader>
            </Table>
        ),
    };

    /** Combination of all header cell states */
    const AllHeaderStates = {
        args: {
            variant: 'head',
            children: 'Header',
        },
        decorators: [
            withCombinations({
                firstColStyle: { minWidth: '200px' },
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
        render: ({ children, ...args }: any) => (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell {...args}>{children}</TableCell>
                    </TableRow>
                </TableHeader>
            </Table>
        ),
    };

    return { meta, Default, Header, AllHeaderStates };
}
