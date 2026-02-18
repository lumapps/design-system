<template>
    <ProgressCircular :theme="theme" />
</template>

<script setup lang="ts">
import { ProgressCircular, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
