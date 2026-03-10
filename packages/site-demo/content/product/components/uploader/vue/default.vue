<template>
    <Uploader :icon="mdiTextBoxPlus" label="Add files" :theme="theme" />
</template>

<script setup lang="ts">
import { mdiTextBoxPlus } from '@lumx/icons';
import { Uploader, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
