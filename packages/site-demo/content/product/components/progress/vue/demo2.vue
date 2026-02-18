<template>
    <ProgressLinear :theme="theme" />
</template>

<script setup lang="ts">
import { ProgressLinear, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
