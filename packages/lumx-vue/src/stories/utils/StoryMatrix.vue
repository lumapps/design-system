<template>
    <table :style="[{ borderCollapse: 'separate', borderSpacing: '8px' }, tableStyle]">
        <thead>
            <tr>
                <th aria-hidden="true" :style="firstColStyle"></th>
                <template v-if="hasMultipleCols">
                    <th v-for="col in cols" :key="String(col)">
                        <small>{{ col === undefined ? 'undefined' : col }}</small>
                    </th>
                </template>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="String(row)">
                <th :style="[{ textAlign: 'left' }, firstColStyle]">
                    <small>{{ row === undefined ? 'undefined' : row }}</small>
                </th>
                <td v-for="col in cols" :key="String(col)" :style="[{ textAlign: 'left' }, cellStyle]">
                    <slot :row="row" :col="col"></slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts" generic="Row = any, Col = any">
import { computed, CSSProperties } from 'vue';

interface StoryMatrixProps {
    rows: Row[];
    cols?: Col[];
    tableStyle?: CSSProperties;
    firstColStyle?: CSSProperties;
    cellStyle?: CSSProperties;
}

defineSlots<{
    default(props: { row: Row; col: Col }): any;
}>();

const props = withDefaults(defineProps<StoryMatrixProps>(), {
    cols: () => [null] as any,
    tableStyle: undefined,
    firstColStyle: undefined,
    cellStyle: undefined,
});

const hasMultipleCols = computed(() => {
    // Show headers only if cols were explicitly provided and have actual values
    return props.cols.length > 1 || props.cols[0] !== null;
});
</script>
