<template>
    <LinkPreview
        title="Link title"
        description="Description"
        link="https://google.com"
        :theme="theme"
        :thumbnail-props="{ image: 'https://picsum.photos/id/256/800/546', alt: 'Landscape' }"
    />
</template>

<script setup lang="ts">
import { LinkPreview, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
