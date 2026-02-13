import { setup } from '@lumx/core/js/components/Table/Stories';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '.';

const { meta, ...stories } = setup({
    component: Table,
    overrides: {
        Default: {
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
        },
        WithHeader: {
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
        },
    },
});

export default {
    title: 'LumX components/table/Table',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithHeader = { ...stories.WithHeader };
