<script setup lang="ts">
import { mdiMessageTextOutline } from '@lumx/icons';
import { Icon } from '@lumx/vue';

defineProps({
    theme: String,
});
</script>

<template>
    <div style="display: flex; align-items: center; gap: 8px;">
        <Icon :icon="mdiMessageTextOutline" size="s" has-shape :theme="theme" />
        <Icon :icon="mdiMessageTextOutline" size="m" has-shape :theme="theme" />
        <Icon :icon="mdiMessageTextOutline" size="l" has-shape :theme="theme" />
        <Icon :icon="mdiMessageTextOutline" size="xl" has-shape :theme="theme" />
    </div>
</template>
