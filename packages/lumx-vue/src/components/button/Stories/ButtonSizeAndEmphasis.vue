<template>
    <StoryMatrix :rows="buttonEmphasis" :cols="sizes">
        <template #default="{ row, col }">
            <Button v-bind="$attrs" :size="col" :emphasis="row">Button</Button>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Button, Emphasis, Size } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';

defineOptions({
    inheritAttrs: false,
});

const buttonEmphasis = [Emphasis.high, Emphasis.medium, Emphasis.low];
const sizes = [Size.s, Size.m];
</script>
