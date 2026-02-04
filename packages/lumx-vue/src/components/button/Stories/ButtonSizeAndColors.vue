<template>
    <StoryMatrix :rows="colors" :cols="sizes">
        <template #default="{ row, col }">
            <Button v-bind="$attrs" :size="col" :color="row">Button</Button>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Button, ColorPalette, Size } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

defineOptions({
    inheritAttrs: false,
});

const sizes = [Size.s, Size.m];
const colors = withUndefined(ColorPalette);
</script>
