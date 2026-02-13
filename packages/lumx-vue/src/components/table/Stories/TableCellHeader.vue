<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableCell v-bind="$attrs">
                    <slot />
                </TableCell>
            </TableRow>
        </TableHeader>
    </Table>
</template>

<script setup lang="ts">
import { Table, TableCell, TableHeader, TableRow } from '@lumx/vue';
</script>
