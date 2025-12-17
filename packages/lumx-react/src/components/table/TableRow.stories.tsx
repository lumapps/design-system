import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

import { Table, TableBody, TableCell, TableRow } from '.';

export default {
    title: 'Lumx components/table/TableRow',
    component: TableRow,
    argTypes: {
        children: { control: false },
    },
};

/** Simple table row */
export const Default = {
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
};

/** Combination of all states */
export const AllStates = {
    ...Default,
    decorators: [
        withCombinations({
            firstColStyle: { minWidth: 200 },
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
