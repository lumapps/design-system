<template>
    <Table :has-dividers="true" :theme="theme" :style="{ minWidth: '620px' }">
        <TableBody>
            <TableRow :is-clickable="true">
                <TableCell>Clickable table row</TableCell>
                <TableCell width="150">Lorem ipsum</TableCell>
            </TableRow>
            <TableRow :is-clickable="true" :is-disabled="true">
                <TableCell>Disabled clickable table row</TableCell>
                <TableCell width="150">Lorem ipsum</TableCell>
            </TableRow>
            <TableRow :is-clickable="true" :is-selected="true">
                <TableCell>Selected clickable table row</TableCell>
                <TableCell width="150">Lorem ipsum</TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableRow, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
