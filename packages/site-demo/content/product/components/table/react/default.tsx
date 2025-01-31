import { mdiCommentOutline, mdiDotsVertical, mdiInformationOutline } from '@lumx/icons';
import {
    Alignment,
    AspectRatio,
    Emphasis,
    FlexBox,
    IconButton,
    Link,
    Orientation,
    Size,
    Table,
    TableBody,
    TableCell,
    TableCellVariant,
    TableHeader,
    TableHeaderProps,
    TableRow,
    Theme,
    ThOrder,
    Thumbnail,
    ThumbnailVariant,
} from '@lumx/react';

import orderBy from 'lodash/orderBy';
import React, { useCallback, useState } from 'react';

const initialTable = [
    {
        calories: 159,
        comments: 'Lorem ipsum',
        dessert: 'Frozen yogurt',
        fat: 6.0,
        id: 1,
        image: '/demo-assets/landscape1.jpg',
    },
    {
        calories: 237,
        comments: 'Lorem ipsum',
        dessert: 'Ice cream sandwich',
        fat: 9.0,
        id: 2,
        image: '/demo-assets/landscape2.jpg',
    },
    {
        calories: 262,
        comments: 'Lorem ipsum',
        dessert: 'Eclair',
        fat: 16.0,
        id: 3,
        image: '/demo-assets/landscape3.jpg',
    },
];

const initialHeaders: Array<Partial<TableHeaderProps>> = [
    {
        isSortable: true,
        label: 'Dessert',
        name: 'dessert',
    },
    {
        isSortable: true,
        label: 'Calories',
        name: 'calories',
        width: '100',
    },
    {
        isSortable: true,
        label: 'Fat (g)',
        name: 'fat',
        sortOrder: ThOrder.asc,
        width: '100',
    },
    {
        icon: mdiCommentOutline,
        isSortable: false,
        label: 'Comments',
        name: 'comments',
        width: '150',
    },
];

export const App = ({ theme = Theme.light }: any) => {
    const [tableHeader, setTableHeader] = useState(initialHeaders);
    const [tableBody, setTableBody] = useState(initialTable);
    const toggleSort = useCallback(
        (header: Partial<TableHeaderProps>) => {
            const sortOrder = header.sortOrder === ThOrder.asc ? ThOrder.desc : ThOrder.asc;
            setTableHeader(
                tableHeader.map((h) => ({
                    ...h,
                    sortOrder: h.name === header.name ? sortOrder : null,
                })),
            );
            setTableBody(orderBy(tableBody, header.name, sortOrder));
        },
        [tableHeader, tableBody],
    );

    return (
        <Table hasDividers theme={theme} style={{ minWidth: 620 }}>
            <TableHeader>
                <TableRow>
                    {tableHeader.map((header) => {
                        const onHeaderClick = () => toggleSort(header);
                        return (
                            <TableCell
                                key={header.name}
                                icon={header.icon}
                                isSortable={header.isSortable}
                                sortOrder={header.sortOrder}
                                variant={TableCellVariant.head}
                                onHeaderClick={header.isSortable && onHeaderClick}
                                width={header.width}
                            >
                                {header.label}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHeader>

            <TableBody>
                {tableBody.map((body) => (
                    <TableRow key={body.id}>
                        <TableCell>
                            <FlexBox orientation={Orientation.horizontal} hAlign={Alignment.center}>
                                <Thumbnail
                                    className="lumx-spacing-margin-right-big"
                                    image={body.image}
                                    aspectRatio={AspectRatio.square}
                                    alt={body.dessert}
                                    size={Size.m}
                                    variant={ThumbnailVariant.rounded}
                                />
                                <Link color={theme === 'dark' ? 'light' : 'dark'} href="./">
                                    <span className="lumx-typography-subtitle1">{body.dessert}</span>
                                </Link>

                                <FlexBox
                                    orientation={Orientation.horizontal}
                                    hAlign={Alignment.center}
                                    marginAuto={Alignment.left}
                                >
                                    <IconButton
                                        emphasis={Emphasis.low}
                                        icon={mdiInformationOutline}
                                        label="Informations"
                                        theme={theme}
                                    />
                                    <IconButton
                                        emphasis={Emphasis.low}
                                        icon={mdiDotsVertical}
                                        label="More options"
                                        theme={theme}
                                    />
                                </FlexBox>
                            </FlexBox>
                        </TableCell>
                        <TableCell>{String(body.calories)}</TableCell>
                        <TableCell>{String(body.fat)}</TableCell>
                        <TableCell>{body.comments}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
