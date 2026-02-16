<template>
    <div style="width: 100px; height: 10px">
        <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Free" aspect-ratio="free" fill-height />
    </div>

    <div style="width: 100px">
        <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Horizontal" aspect-ratio="horizontal" />
    </div>

    <div style="width: 100px">
        <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Original" aspect-ratio="original" />
    </div>

    <div style="width: 100px">
        <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Square" aspect-ratio="square" />
    </div>

    <div style="width: 100px">
        <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Vertical" aspect-ratio="vertical" />
    </div>

    <div style="width: 100px">
        <Thumbnail image="https://picsum.photos/id/535/640/480" alt="Wide" aspect-ratio="wide" />
    </div>
</template>

<script setup lang="ts">
import { Thumbnail } from '@lumx/vue';
</script>
