<template>
    <Icon :icon="mdiMessageTextOutline" size="s" :has-shape="true" :theme="theme" />
    <Icon :icon="mdiMessageTextOutline" size="m" :has-shape="true" :theme="theme" />
    <Icon :icon="mdiMessageTextOutline" size="l" :has-shape="true" :theme="theme" />
    <Icon :icon="mdiMessageTextOutline" size="xl" :has-shape="true" :theme="theme" />
</template>

<script setup lang="ts">
import { mdiMessageTextOutline } from '@lumx/icons';
import { Icon, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
