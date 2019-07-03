import {
    Table,
    TableBody,
    TableCell,
    TableCellVariant,
    TableHeader,
    TableRow,
    TableTheme,
    ThOrder,
    ThScope,
} from 'LumX';

import React, { ReactElement, useCallback, useState } from 'react';

import orderBy from 'lodash/orderBy';

import { mdiCommentOutline } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: TableTheme;
}

interface IBody {
    calories: number;
    comments: string;
    dessert: string;
    fat: number;
    id: number;
    variant?: TableCellVariant;
}

interface IHead {
    icon?: string;
    isSortable?: boolean;
    label: string;
    name: string;
    scope?: ThScope;
    sortOrder?: ThOrder;
    variant: TableCellVariant;
}

/////////////////////////////

/**
 * The body of the table.
 * This represents the data to display in the table.
 */
const tableBody: IBody[] = [
    {
        calories: 159,
        comments: 'Lorem ipsum',
        dessert: 'Frozen yogurt',
        fat: 6.0,
        id: 1,
        variant: TableCellVariant.body,
    },
    {
        calories: 237,
        comments: 'Lorem ipsum',
        dessert: 'Ice cream sandwich',
        fat: 9.0,
        id: 2,
        variant: TableCellVariant.body,
    },
    {
        calories: 262,
        comments: 'Lorem ipsum',
        dessert: 'Eclair',
        fat: 16.0,
        id: 3,
        variant: TableCellVariant.body,
    },
];

/**
 * The head of the table.
 * This represents the cells of the table.
 */
const tableHead: IHead[] = [
    {
        isSortable: true,
        label: 'Dessert',
        name: 'dessert',
        scope: ThScope.col,
        variant: TableCellVariant.head,
    },
    {
        isSortable: true,
        label: 'Calories',
        name: 'calories',
        scope: ThScope.col,
        variant: TableCellVariant.head,
    },
    {
        isSortable: true,
        label: 'Fat (g)',
        name: 'fat',
        scope: ThScope.col,
        variant: TableCellVariant.head,
    },
    {
        icon: mdiCommentOutline,
        isSortable: false,
        label: 'Comments',
        name: 'comments',
        scope: ThScope.col,
        variant: TableCellVariant.head,
    },
];

/////////////////////////////

/**
 * The demo for the default <Table>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [dataTableBody, setTable] = useState(tableBody);

    /**
     * Update the sorting of the table.
     *
     * @param headSource The head cell to sort the table by.
     */
    const handleSort = useCallback(
        (headSource: IHead) => {
            tableHead.map((head: IHead) => {
                if (head !== headSource) {
                    head.sortOrder = undefined;
                }
            });

            if (headSource.sortOrder === ThOrder.asc) {
                headSource.sortOrder = ThOrder.desc;
            } else {
                headSource.sortOrder = ThOrder.asc;
            }

            setTable(orderBy(tableBody, headSource.name, headSource.sortOrder));
        },
        [dataTableBody],
    );

    return (
        <Table hasDividers theme={theme}>
            <TableHeader>
                <TableRow>
                    {tableHead.map((head: IHead, key: number) => {
                        return (
                            <TableCell
                                key={`th-${key}`}
                                icon={head.icon}
                                isSortable={head.isSortable}
                                scope={head.scope}
                                sortOrder={head.sortOrder}
                                variant={head.variant}
                                onHeaderClick={(): void => handleSort(head)}
                            >
                                {head.label}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHeader>

            <TableBody>
                {dataTableBody.map((body: IBody, key: number) => {
                    return (
                        <TableRow key={`tr-${key}`}>
                            <TableCell>{body.dessert}</TableCell>
                            <TableCell>{String(body.calories)}</TableCell>
                            <TableCell>{String(body.fat)}</TableCell>
                            <TableCell>{body.comments}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
