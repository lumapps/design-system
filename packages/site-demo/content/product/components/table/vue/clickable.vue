<template>
    <Table has-dividers :theme="theme" :style="{ minWidth: '620px' }">
        <TableBody>
            <TableRow is-clickable>
                <TableCell>Clickable table row</TableCell>
                <TableCell width="150">Lorem ipsum</TableCell>
            </TableRow>
            <TableRow is-clickable is-disabled>
                <TableCell>Disabled clickable table row</TableCell>
                <TableCell width="150">Lorem ipsum</TableCell>
            </TableRow>
            <TableRow is-clickable is-selected>
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
