<template>
    <StoryMatrix :rows="shapes" :cols="sizes">
        <template #default="{ row, col }">
            <Icon v-bind="$attrs" :size="col" :has-shape="row" />
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Icon, IconSizes, Size } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

defineOptions({
    inheritAttrs: false,
});

const iconSizes: Array<IconSizes> = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];
const sizes = withUndefined(iconSizes);
const shapes = [true, false];
</script>
