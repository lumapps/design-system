<template>
    <Thumbnail image="https://picsum.photos/id/24/640/480" alt="Landscape" aspect-ratio="original" size="xl" />

    <Thumbnail
        image="https://picsum.photos/id/885/300/500"
        alt="Portrait"
        aspect-ratio="vertical"
        size="xl"
        variant="rounded"
    />

    <Thumbnail alt="Square" image="https://picsum.photos/id/1/128/128" aspect-ratio="square" size="l" />
</template>

<script setup lang="ts">
import { Thumbnail } from '@lumx/vue';
</script>
