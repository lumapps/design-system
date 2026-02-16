<template>
    <Table v-bind="$attrs">
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
import { Table, TableBody, TableCell, TableRow } from '@lumx/vue';
</script>
