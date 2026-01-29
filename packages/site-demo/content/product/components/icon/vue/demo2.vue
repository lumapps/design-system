<template>
    <Icon :icon="mdiMessageTextOutline" size="s" has-shape :theme="theme" />
    <Icon :icon="mdiMessageTextOutline" size="m" has-shape :theme="theme" />
    <Icon :icon="mdiMessageTextOutline" size="l" has-shape :theme="theme" />
    <Icon :icon="mdiMessageTextOutline" size="xl" has-shape :theme="theme" />
</template>

<script setup lang="ts">
import { mdiMessageTextOutline } from '@lumx/icons';
import { Icon, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
