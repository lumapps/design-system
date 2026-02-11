<template>
    <SkeletonCircle :theme="theme" size="m" />
    <SkeletonCircle :theme="theme" size="l" />
    <SkeletonCircle :theme="theme" size="xl" />
</template>

<script setup lang="ts">
import { SkeletonCircle, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
