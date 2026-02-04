<template>
    <StoryMatrix :rows="colors" :cols="variants">
        <template #default="{ row, col }">
            <Icon v-bind="$attrs" :color="row" :color-variant="col" />
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Icon, ColorPalette, ColorVariant } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

defineOptions({
    inheritAttrs: false,
});

const colors = withUndefined(ColorPalette);
const variants = withUndefined(ColorVariant);
</script>
