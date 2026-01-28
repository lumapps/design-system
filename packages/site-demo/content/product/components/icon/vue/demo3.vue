<script setup lang="ts">
import { mdiArrowRight, mdiCheck, mdiAlertCircle, mdiAlert, mdiBullhorn, mdiMessageText } from '@lumx/icons';
import { Icon, Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>

<template>
    <Icon :icon="mdiArrowRight" size="s" color="blue" />
    <Icon :icon="mdiCheck" size="s" color="green" />
    <Icon :icon="mdiAlertCircle" size="s" color="yellow" />
    <Icon :icon="mdiAlert" size="s" color="red" />
    <Icon :icon="mdiBullhorn" size="m" color="blue" :theme="theme" hasShape />
    <Icon :icon="mdiAlertCircle" size="m" color="yellow" :theme="theme" hasShape />
    <Icon :icon="mdiAlert" size="m" :theme="theme" color="red" hasShape />
    <Icon :icon="mdiCheck" size="m" :theme="theme" color="green" hasShape />
    <Icon :icon="mdiMessageText" size="m" color="dark" :theme="theme" hasShape />
</template>
