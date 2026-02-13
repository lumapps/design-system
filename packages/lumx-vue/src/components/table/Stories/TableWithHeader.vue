<template>
    <Table v-bind="$attrs">
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
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@lumx/vue';
</script>
