<template>
    <StoryMatrix :rows="colors" :cols="variants">
        <template #default="{ row, col }">
            <Icon v-bind="props" :color="row" :color-variant="col" />
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Icon, ColorPalette, ColorVariant, IconProps } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<IconProps>();
const colors = withUndefined(ColorPalette);
const variants = withUndefined(ColorVariant);
</script>
