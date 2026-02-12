<template>
    <Button emphasis="low" :theme="theme">Default</Button>
    <Button :disabled="true" emphasis="low" :theme="theme">Disabled</Button>
    <Button :left-icon="mdiPencil" emphasis="low" :theme="theme">With Icon</Button>
    <Button :right-icon="mdiMenuDown" emphasis="low" :theme="theme">Dropdown</Button>
    <IconButton label="Add" emphasis="low" :icon="mdiPlus" :theme="theme" />
</template>

<script setup lang="ts">
import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, IconButton, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
