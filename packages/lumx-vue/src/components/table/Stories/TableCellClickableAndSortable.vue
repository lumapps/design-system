<template>
    <Table v-bind="$attrs">
        <TableHeader>
            <TableRow>
                <TableCell
                    variant="head"
                    :is-sortable="true"
                    :sort-order="sortOrders.name"
                    @header-click="handleSort('name')"
                >
                    Name
                </TableCell>
                <TableCell
                    variant="head"
                    :is-sortable="true"
                    :sort-order="sortOrders.age"
                    @header-click="handleSort('age')"
                >
                    Age
                </TableCell>
                <TableCell
                    variant="head"
                    :is-sortable="true"
                    :sort-order="sortOrders.email"
                    @header-click="handleSort('email')"
                >
                    Email
                </TableCell>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="row in sortedData" :key="row.id">
                <TableCell>{{ row.name }}</TableCell>
                <TableCell>{{ row.age }}</TableCell>
                <TableCell>{{ row.email }}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Table, TableBody, TableCell, TableHeader, TableRow, ThOrder } from '@lumx/vue';
import type { ThOrderType } from '@lumx/vue';

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

const sortOrders = ref<SortOrders>({});
const currentSortColumn = ref<keyof Omit<DataRow, 'id'> | null>(null);

const handleSort = (column: keyof Omit<DataRow, 'id'>) => {
    console.log('handleSort called for column:', column);

    // Reset other columns
    if (currentSortColumn.value && currentSortColumn.value !== column) {
        sortOrders.value[currentSortColumn.value] = undefined;
    }

    // Cycle through: none → asc → desc → none
    const currentOrder = sortOrders.value[column];
    if (!currentOrder) {
        sortOrders.value[column] = ThOrder.asc;
    } else if (currentOrder === ThOrder.asc) {
        sortOrders.value[column] = ThOrder.desc;
    } else {
        sortOrders.value[column] = undefined;
    }

    currentSortColumn.value = sortOrders.value[column] ? column : null;
    console.log('New sort state:', { column, order: sortOrders.value[column] });
};

const sortedData = computed(() => {
    if (!currentSortColumn.value) {
        return data;
    }

    const column = currentSortColumn.value;
    const order = sortOrders.value[column];

    return [...data].sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];

        if (aVal < bVal) return order === ThOrder.asc ? -1 : 1;
        if (aVal > bVal) return order === ThOrder.asc ? 1 : -1;
        return 0;
    });
});
</script>
