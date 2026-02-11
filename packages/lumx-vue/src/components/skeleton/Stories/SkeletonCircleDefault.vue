<template>
    <SkeletonCircle v-bind="attrs" />
</template>

<script setup lang="ts">
import { SkeletonCircle } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();
</script>
