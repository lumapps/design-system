<script setup lang="ts">
import { mdiEmail } from '@lumx/icons';
import { Icon, Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>

<template>
    <Icon :icon="mdiEmail" size="xxs" :theme="theme" />
    <Icon :icon="mdiEmail" size="xs" :theme="theme" />
    <Icon :icon="mdiEmail" size="s" :theme="theme" />
    <Icon :icon="mdiEmail" size="m" :theme="theme" />
    <Icon :icon="mdiEmail" size="l" :theme="theme" />
    <Icon :icon="mdiEmail" size="xl" :theme="theme" />
</template>
