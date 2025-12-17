import { Table, TableBody, TableCell, TableHeader, TableRow } from '.';

export default {
    title: 'Lumx components/table/Table',
    component: Table,
    args: {
        hasBefore: false,
        hasDividers: false,
    },
};

/** Simple table */
export const Default = {
    render: (args: any) => (
        <Table {...args}>
            <TableBody>
                <TableRow>
                    <TableCell>Cell 1</TableCell>
                    <TableCell>Cell 2</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Cell 3</TableCell>
                    <TableCell>Cell 4</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};

/** Table with header */
export const WithHeader = {
    render: (args: any) => (
        <Table {...args}>
            <TableHeader>
                <TableRow>
                    <TableCell variant="head">Header 1</TableCell>
                    <TableCell variant="head">Header 2</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>Cell 1</TableCell>
                    <TableCell>Cell 2</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Cell 3</TableCell>
                    <TableCell>Cell 4</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
};
