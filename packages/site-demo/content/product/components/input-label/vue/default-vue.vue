<script setup lang="ts">
import { InputLabel } from '@lumx/vue';

defineProps({ theme: String });
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <InputLabel :theme="theme" for="id1">Label</InputLabel>
    <InputLabel :theme="theme" for="id2" is-required>Required Label</InputLabel>
  </div>
</template>
