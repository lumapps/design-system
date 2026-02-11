<template>
    <SkeletonRectangle v-bind="attrs" />
</template>

<script setup lang="ts">
import { SkeletonRectangle } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();
</script>
