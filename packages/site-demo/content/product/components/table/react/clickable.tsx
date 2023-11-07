import { Alignment, FlexBox, Orientation, Table, TableBody, TableCell, TableRow, Theme } from '@lumx/react';

import React, { useState } from 'react';

const initialTable = [
    {
        calories: 159,
        comments: 'Lorem ipsum',
        title: 'Clickable table row',
        fat: 6.0,
        id: 1,
        image: '/demo-assets/landscape1.jpg',
        isSelected: false,
        isDisabled: false,
    },
    {
        calories: 159,
        comments: 'Lorem ipsum',
        title: 'Disabled clickable table row',
        fat: 6.0,
        id: 1,
        image: '/demo-assets/landscape1.jpg',
        isSelected: false,
        isDisabled: true,
    },
    {
        calories: 237,
        comments: 'Lorem ipsum',
        title: 'Selected clickable table row',
        fat: 9.0,
        id: 2,
        image: '/demo-assets/landscape2.jpg',
        isSelected: true,
        isDisabled: false,
    },
];

export const App = ({ theme = Theme.light }: any) => {
    const [tableBody] = useState(initialTable);

    return (
        <Table hasDividers theme={theme} style={{ minWidth: 620 }}>
            <TableBody>
                {tableBody.map((core) => (
                    <TableRow key={core.id} isClickable isSelected={core.isSelected} isDisabled={core.isDisabled}>
                        <TableCell>
                            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                                {core.title}
                            </FlexBox>
                        </TableCell>
                        <TableCell width='100'>{String(core.calories)}</TableCell>
                        <TableCell width='150'>{String(core.fat)}</TableCell>
                        <TableCell width='150'>{core.comments}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
