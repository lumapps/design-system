<template>
    <Thumbnail
        image="brokenurl.jpg"
        alt="broken url image"
        aspect-ratio="square"
        size="xl"
        variant="rounded"
        :theme="theme"
    />
</template>

<script setup lang="ts">
import { Thumbnail, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
