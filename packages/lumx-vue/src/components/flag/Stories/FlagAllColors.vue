<template>
    <StoryMatrix :rows="colors">
        <template #default="{ row }">
            <Flag v-bind="$attrs" :color="row">
                <slot />
            </Flag>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Flag, ColorPalette } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

defineOptions({
    inheritAttrs: false,
});

const colors = withUndefined(ColorPalette);
</script>
