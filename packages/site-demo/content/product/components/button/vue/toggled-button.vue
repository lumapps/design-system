<template>
    <Button :theme="theme" emphasis="medium">Subscribe</Button>
    <Button :theme="theme" emphasis="medium" :left-icon="mdiCheck" :isSelected="true">Subscribed</Button>
    <IconButton :theme="theme" label="Subscribe" emphasis="medium" :icon="mdiBellPlus" />
    <IconButton :theme="theme" label="Subscribed" emphasis="medium" :icon="mdiBellRing" :isSelected="true" />
</template>

<script setup lang="ts">
import { mdiBellPlus, mdiBellRing, mdiCheck } from '@lumx/icons';
import { Button, IconButton, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
