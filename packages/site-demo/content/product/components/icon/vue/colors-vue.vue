<script setup lang="ts">
import { mdiAlert, mdiAlertCircle, mdiArrowRight, mdiBullhorn, mdiCheck, mdiMessageText } from '@lumx/icons';
import { Icon, ColorPalette, Theme } from '@lumx/vue';

defineProps({
    theme: {
        type: String,
        default: Theme.light,
    },
});
</script>

<template>
    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <Icon :icon="mdiArrowRight" size="s" :color="ColorPalette.blue" />
        <Icon :icon="mdiCheck" size="s" :color="ColorPalette.green" />
        <Icon :icon="mdiAlertCircle" size="s" :color="ColorPalette.yellow" />
        <Icon :icon="mdiAlert" size="s" :color="ColorPalette.red" />
        <Icon :icon="mdiBullhorn" size="m" :color="ColorPalette.blue" :theme="theme" has-shape />
        <Icon :icon="mdiAlertCircle" size="m" :color="ColorPalette.yellow" :theme="theme" has-shape />
        <Icon :icon="mdiAlert" size="m" :theme="theme" :color="ColorPalette.red" has-shape />
        <Icon :icon="mdiCheck" size="m" :theme="theme" :color="ColorPalette.green" has-shape />
        <Icon :icon="mdiMessageText" size="m" :color="ColorPalette.dark" :theme="theme" has-shape />
        <span :class="theme === 'dark' ? 'lumx-color-font-light-N' : ''">Without color:</span>
        <Icon :icon="mdiMessageText" size="m" :theme="theme" has-shape />
    </div>
</template>
