<template>
    <Uploader :icon="mdiImagePlus" label="Add picture" :theme="theme" :variant="UploaderVariant.rounded" />
</template>

<script setup lang="ts">
import { mdiImagePlus } from '@lumx/icons';
import { Uploader, UploaderVariant, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
