<template>
    <Flag :icon="mdiHeart" color="blue">blue flag</Flag>
    <Flag :icon="mdiHeart" color="dark">dark flag</Flag>
    <Flag :icon="mdiHeart" color="green">green flag</Flag>
    <Flag :icon="mdiHeart" color="red">red flag</Flag>
    <Flag :icon="mdiHeart" color="yellow">yellow flag</Flag>
</template>

<script setup lang="ts">
import { mdiHeart } from '@lumx/icons';
import { Flag } from '@lumx/vue';
</script>
