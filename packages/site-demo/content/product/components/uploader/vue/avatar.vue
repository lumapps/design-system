<template>
    <Uploader :icon="mdiImagePlus" label="Add photo" :theme="theme" :variant="UploaderVariant.circle" />
</template>

<script setup lang="ts">
import { mdiImagePlus } from '@lumx/icons';
import { Uploader, UploaderVariant, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
