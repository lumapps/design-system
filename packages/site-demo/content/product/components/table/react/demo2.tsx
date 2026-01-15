import { Table, TableBody, TableCell, TableRow, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <Table hasDividers theme={theme} style={{ minWidth: 620 }}>
        <TableBody>
            <TableRow isClickable>
                <TableCell>Clickable table row</TableCell>
                <TableCell width="150">Lorem ipsum</TableCell>
            </TableRow>
            <TableRow isClickable isDisabled>
                <TableCell>Disabled clickable table row</TableCell>
                <TableCell width="150">Lorem ipsum</TableCell>
            </TableRow>
            <TableRow isClickable isSelected>
                <TableCell>Selected clickable table row</TableCell>
                <TableCell width="150">Lorem ipsum</TableCell>
            </TableRow>
        </TableBody>
    </Table>
);
