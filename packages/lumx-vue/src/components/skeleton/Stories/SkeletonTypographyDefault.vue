<template>
    <SkeletonTypography v-bind="attrs" />
</template>

<script setup lang="ts">
import { SkeletonTypography } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();
</script>
