<template>
    <table style="border-collapse: separate; border-spacing: 8px">
        <thead>
            <tr>
                <th aria-hidden="true"></th>
                <template v-if="hasMultipleCols">
                    <th v-for="col in cols" :key="String(col)">
                        <small>{{ col === undefined ? 'undefined' : col }}</small>
                    </th>
                </template>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="String(row)">
                <th style="text-align: left">
                    <small>{{ row === undefined ? 'undefined' : row }}</small>
                </th>
                <td v-for="col in cols" :key="String(col)" style="text-align: center">
                    <slot :row="row" :col="col"></slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    rows: {
        type: Array,
        required: true,
    },
    cols: {
        type: Array,
        // Default to a single-item array so the loop runs once
        default: () => [null],
    },
});

const hasMultipleCols = computed(() => {
    // Show headers only if cols were explicitly provided and have actual values
    return props.cols.length > 1 || props.cols[0] !== null;
});
</script>
