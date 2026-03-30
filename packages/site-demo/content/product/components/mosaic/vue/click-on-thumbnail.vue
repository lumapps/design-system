<template>
    <div style="width: 250px">
        <Mosaic :thumbnails="thumbnails" @handle-click="onImageClick" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Mosaic } from '@lumx/vue';

const IMAGES = [
    { image: 'https://picsum.photos/id/256/800/546', alt: 'Landscape 1; Open in a fullscreen image slideshow' },
    { image: 'https://picsum.photos/id/535/640/480', alt: 'Landscape 2; Open in a fullscreen image slideshow' },
    { image: 'https://picsum.photos/id/24/640/480', alt: 'Landscape 3; Open in a fullscreen image slideshow' },
    { image: 'https://picsum.photos/id/653/275/500', alt: 'Portrait 1; Open in a fullscreen image slideshow' },
    { image: 'https://picsum.photos/id/670/350/500', alt: 'Portrait 2; Open in a fullscreen image slideshow' },
    { image: 'https://picsum.photos/id/885/300/500', alt: 'Portrait 3; Open in a fullscreen image slideshow' },
];

const activeIndex = ref<number | null>(null);
const thumbnails = IMAGES.map((image) => ({ ...image }));

const onImageClick = (index: number) => {
    activeIndex.value = index;
};
</script>
