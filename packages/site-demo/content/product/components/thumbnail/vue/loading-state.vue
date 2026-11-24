<template>
    <Thumbnail
        is-loading
        image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
        alt="loading image"
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
