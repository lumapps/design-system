import type { SetupStoriesOptions } from '../../../stories/types';
import { DEFAULT_PROPS } from '.';

export function setup({
    component: Table,
    components: { TableBody, TableCell, TableHeader, TableRow },
}: SetupStoriesOptions<{
    components: { TableBody: any; TableCell: any; TableHeader: any; TableRow: any };
    decorators?: never;
}>) {
    return {
        meta: {
            component: Table,
            args: {
                ...DEFAULT_PROPS,
                hasBefore: false,
                hasDividers: false,
            },
        },

        /** Simple table */
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

        /** Table with header */
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
    };
}
