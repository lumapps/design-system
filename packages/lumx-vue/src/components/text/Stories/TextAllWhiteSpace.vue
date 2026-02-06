<template>
    <StoryMatrix
        :rows="whiteSpaces"
        :table-style="styles.tableStyle"
        :first-col-style="styles.firstColStyle"
        :cell-style="styles.cellStyle"
    >
        <template #default="{ row }">
            <Text as="p" v-bind="$attrs" :white-space="row">
                <slot />
            </Text>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Text, WhiteSpace } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';

defineOptions({
    inheritAttrs: false,
});

const whiteSpaces = Object.values(WhiteSpace);
const styles = {
    tableStyle: { width: '500px', tableLayout: 'fixed' },
    firstColStyle: { width: '100px' },
    cellStyle: { border: '1px solid #000', width: '100%' },
};
</script>
