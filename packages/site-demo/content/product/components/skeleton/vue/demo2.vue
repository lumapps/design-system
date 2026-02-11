<template>
    <SkeletonRectangle :theme="theme" width="xl" aspect-ratio="horizontal" />
    <SkeletonRectangle :theme="theme" width="xl" height="m" variant="rounded" />
    <SkeletonRectangle :theme="theme" width="m" height="s" variant="pill" />
    <SkeletonRectangle :theme="theme" width="l" height="s" variant="pill" />
</template>

<script setup lang="ts">
import { SkeletonRectangle, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
