<template>
    <Icon :icon="mdiArrowRight" size="s" color="blue" />
    <Icon :icon="mdiCheck" size="s" color="green" />
    <Icon :icon="mdiAlertCircle" size="s" color="yellow" />
    <Icon :icon="mdiAlert" size="s" color="red" />
    <Icon :icon="mdiBullhorn" size="m" color="blue" :theme="theme" has-shape />
    <Icon :icon="mdiAlertCircle" size="m" color="yellow" :theme="theme" has-shape />
    <Icon :icon="mdiAlert" size="m" :theme="theme" color="red" has-shape />
    <Icon :icon="mdiCheck" size="m" :theme="theme" color="green" has-shape />
    <Icon :icon="mdiMessageText" size="m" color="dark" :theme="theme" has-shape />
</template>

<script setup lang="ts">
import { mdiArrowRight, mdiCheck, mdiAlertCircle, mdiAlert, mdiBullhorn, mdiMessageText } from '@lumx/icons';
import { Icon, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
