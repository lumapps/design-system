import { useCallback, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { mdiCommentOutline, mdiDotsVertical, mdiInformationOutline } from '@lumx/icons';
import {
    FlexBox,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    Thumbnail,
    Theme,
    ThOrder,
} from '@lumx/react';

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
const initialHeaders: Array<{
    isSortable: boolean;
    label: string;
    name: string;
    width?: string;
    sortOrder?: ThOrder;
    icon?: string;
}> = [
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
        sortOrder: 'asc',
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

export default ({ theme }: { theme?: Theme }) => {
    const [tableHeader, setTableHeader] = useState(initialHeaders);
    const [tableBody, setTableBody] = useState(initialTable);
    const toggleSort = useCallback(
        (header: (typeof initialHeaders)[number]) => {
            const sortOrder = header.sortOrder === 'asc' ? 'desc' : 'asc';
            setTableHeader(
                tableHeader.map((h) => ({
                    ...h,
                    sortOrder: h.name === header.name ? sortOrder : undefined,
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
                                variant="head"
                                onHeaderClick={header.isSortable ? onHeaderClick : undefined}
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
                            <FlexBox orientation="horizontal" hAlign="center">
                                <Thumbnail
                                    className="lumx-spacing-margin-right-big"
                                    image={body.image}
                                    aspectRatio="square"
                                    alt={body.dessert}
                                    size="m"
                                    variant="rounded"
                                />
                                <Link color={theme === 'dark' ? 'light' : 'dark'} href="./">
                                    <span className="lumx-typography-subtitle1">{body.dessert}</span>
                                </Link>

                                <FlexBox orientation="horizontal" hAlign="center" marginAuto="left">
                                    <IconButton
                                        emphasis="low"
                                        icon={mdiInformationOutline}
                                        label="Informations"
                                        theme={theme}
                                    />
                                    <IconButton
                                        emphasis="low"
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
