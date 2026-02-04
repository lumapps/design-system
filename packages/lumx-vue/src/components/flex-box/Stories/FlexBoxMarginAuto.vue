<template>
    <StoryMatrix :rows="rowOptions" :cols="colOptions">
        <template #default="{ row, col }">
            <div
                :style="{
                    display: 'flex',
                    border: '1px dashed red',
                    width: '100px',
                    height: '100px',
                    margin: '20px auto',
                }"
            >
                <FlexBox v-bind="$attrs" :margin-auto="mergeMarginAuto(row, col)">
                    <IconButton label="" :icon="mdiAtom" />
                </FlexBox>
            </div>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { FlexBox, IconButton, Alignment } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { mdiAtom } from '@lumx/icons';

defineOptions({
    inheritAttrs: false,
});

const rowOptions = [undefined, Alignment.left, Alignment.top, [Alignment.left, Alignment.top]];
const colOptions = [undefined, Alignment.right, Alignment.bottom, [Alignment.right, Alignment.bottom]];

const mergeMarginAuto = (rowVal: any, colVal: any) => {
    if (rowVal && colVal) {
        return [...(Array.isArray(rowVal) ? rowVal : [rowVal]), ...(Array.isArray(colVal) ? colVal : [colVal])];
    }
    return rowVal || colVal;
};
</script>
