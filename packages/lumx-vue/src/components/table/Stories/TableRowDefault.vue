<template>
    <Table>
        <TableBody>
            <TableRow v-bind="$attrs">
                <TableCell>Cell 1</TableCell>
                <TableCell>Cell 2</TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableRow } from '@lumx/vue';
</script>
