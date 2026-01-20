<script setup lang="ts">
import { mdiEmail } from '@lumx/icons';
import { Icon } from '@lumx/vue';

defineProps({
    theme: String,
});
</script>

<template>
    <div style="display: flex; align-items: center; gap: 8px;">
        <Icon :icon="mdiEmail" size="xxs" :theme="theme" />
        <Icon :icon="mdiEmail" size="xs" :theme="theme" />
        <Icon :icon="mdiEmail" size="s" :theme="theme" />
        <Icon :icon="mdiEmail" size="m" :theme="theme" />
        <Icon :icon="mdiEmail" size="l" :theme="theme" />
        <Icon :icon="mdiEmail" size="xl" :theme="theme" />
    </div>
</template>
