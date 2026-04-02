<template>
    <div style="width: 350px">
        <LinkPreview
            title="Link title"
            description="Description"
            link="https://google.com"
            size="big"
            :theme="theme"
            :thumbnail-props="{ image: 'https://picsum.photos/id/24/640/480', alt: 'Landscape' }"
        />
    </div>
</template>

<script setup lang="ts">
import { LinkPreview, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
