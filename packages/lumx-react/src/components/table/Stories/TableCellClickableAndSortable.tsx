import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow, ThOrder } from '@lumx/react';
import type { ThOrderType } from '@lumx/react';

interface SortOrders {
    name?: ThOrderType;
    age?: ThOrderType;
    email?: ThOrderType;
}

interface DataRow {
    id: number;
    name: string;
    age: number;
    email: string;
}

const data: DataRow[] = [
    { id: 1, name: 'John Doe', age: 32, email: 'john@example.com' },
    { id: 2, name: 'Alice Smith', age: 28, email: 'alice@example.com' },
    { id: 3, name: 'Bob Johnson', age: 45, email: 'bob@example.com' },
    { id: 4, name: 'Emma Wilson', age: 35, email: 'emma@example.com' },
    { id: 5, name: 'Charlie Brown', age: 29, email: 'charlie@example.com' },
];

export const TableCellClickableAndSortable: React.FC = () => {
    const [sortOrders, setSortOrders] = useState<SortOrders>({});
    const [currentSortColumn, setCurrentSortColumn] = useState<keyof Omit<DataRow, 'id'> | null>(null);

    const handleSort = (column: keyof Omit<DataRow, 'id'>) => {
        console.log('handleSort called for column:', column);

        // Reset other columns
        if (currentSortColumn && currentSortColumn !== column) {
            setSortOrders((prev) => ({ ...prev, [currentSortColumn]: undefined }));
        }

        // Cycle through: none → asc → desc → none
        const currentOrder = sortOrders[column];
        let newOrder: ThOrderType | undefined;

        if (!currentOrder) {
            newOrder = ThOrder.asc;
        } else if (currentOrder === ThOrder.asc) {
            newOrder = ThOrder.desc;
        } else {
            newOrder = undefined;
        }

        setSortOrders((prev) => ({ ...prev, [column]: newOrder }));
        setCurrentSortColumn(newOrder ? column : null);
        console.log('New sort state:', { column, order: newOrder });
    };

    const sortedData = useMemo(() => {
        if (!currentSortColumn) {
            return data;
        }

        const column = currentSortColumn;
        const order = sortOrders[column];

        return [...data].sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];

            if (aVal < bVal) return order === ThOrder.asc ? -1 : 1;
            if (aVal > bVal) return order === ThOrder.asc ? 1 : -1;
            return 0;
        });
    }, [currentSortColumn, sortOrders]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell
                        variant="head"
                        isSortable
                        sortOrder={sortOrders.name}
                        onHeaderClick={() => handleSort('name')}
                    >
                        Name
                    </TableCell>
                    <TableCell
                        variant="head"
                        isSortable
                        sortOrder={sortOrders.age}
                        onHeaderClick={() => handleSort('age')}
                    >
                        Age
                    </TableCell>
                    <TableCell
                        variant="head"
                        isSortable
                        sortOrder={sortOrders.email}
                        onHeaderClick={() => handleSort('email')}
                    >
                        Email
                    </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedData.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.age}</TableCell>
                        <TableCell>{row.email}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
