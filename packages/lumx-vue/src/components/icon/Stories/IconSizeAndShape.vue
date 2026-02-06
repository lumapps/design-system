<template>
    <StoryMatrix :rows="shapes" :cols="sizes">
        <template #default="{ row, col }">
            <Icon v-bind="props" :size="col" :has-shape="row" />
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Icon, IconProps, IconSizes, Size } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<IconProps>();
const iconSizes: Array<IconSizes> = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];
const sizes = withUndefined(iconSizes);
const shapes = [true, false];
</script>
