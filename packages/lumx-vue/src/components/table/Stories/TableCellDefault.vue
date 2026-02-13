<template>
    <Table>
        <TableBody>
            <TableRow>
                <TableCell v-bind="$attrs">
                    <slot />
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableRow } from '@lumx/vue';
</script>
