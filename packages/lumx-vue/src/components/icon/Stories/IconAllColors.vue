<template>
    <StoryMatrix :rows="colors" :cols="variants">
        <template #default="{ row, col }">
            <Icon v-bind="attrs" :icon="icon" :color="row" :color-variant="col" />
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Icon, ColorPalette, ColorVariant } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

import { useAttrs } from 'vue';

const attrs = useAttrs();
const icon = attrs.icon as string;

defineOptions({
    inheritAttrs: false,
});

const colors = withUndefined(ColorPalette);
const variants = withUndefined(ColorVariant);
</script>
