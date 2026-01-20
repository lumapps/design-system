<script setup lang="ts">
import { InputHelper } from '@lumx/vue';

defineProps({ theme: String });
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <InputHelper :theme="theme">Helper text</InputHelper>
    <InputHelper :theme="theme" kind="error">Error text</InputHelper>
    <InputHelper :theme="theme" kind="success">Success text</InputHelper>
    <InputHelper :theme="theme" kind="warning">Warning text</InputHelper>
  </div>
</template>
