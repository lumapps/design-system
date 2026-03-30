<template>
    <div style="width: 250px">
        <Mosaic
            :thumbnails="[
                { image: 'https://picsum.photos/id/653/275/500', alt: 'Portrait 1' },
                { image: 'https://picsum.photos/id/670/350/500', alt: 'Portrait 2' },
            ]"
        />
    </div>
</template>

<script setup lang="ts">
import { Mosaic } from '@lumx/vue';
</script>
