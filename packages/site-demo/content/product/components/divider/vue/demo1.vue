<template>
    <Divider :theme="theme" class="lumx-spacing-margin-vertical-big" />
</template>

<script setup lang="ts">
import { Divider, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
