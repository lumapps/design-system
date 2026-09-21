<template>
    <InputRequiredLegend label="Indicates a required field" :theme="theme" />
</template>

<script setup lang="ts">
import { InputRequiredLegend, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
