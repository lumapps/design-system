import type { SetupStoriesOptions } from '@lumx/core/stories/types';

export function setup({
    component: TableRow,
    components: { Table, TableBody, TableCell },
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
    components: { Table: any; TableBody: any; TableCell: any };
}>) {
    const meta = {
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
        argTypes: {
            children: { control: false },
        },
    };

    /** Simple table row */
    const Default = {};

    /** Combination of all states */
    const AllStates = {
        decorators: [
            withCombinations({
                firstColStyle: { minWidth: '200px' },
                combinations: {
                    rows: {
                        Default: {},
                        Clickable: { isClickable: true },
                        Selected: { isSelected: true },
                        Disabled: { isDisabled: true },
                        'Clickable & Selected': { isClickable: true, isSelected: true },
                        'Clickable & Disabled': { isClickable: true, isDisabled: true },
                    },
                },
            }),
        ],
    };

    return { meta, Default, AllStates };
}
