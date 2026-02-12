<template>
    <Button :theme="theme">Default</Button>
    <Button :disabled="true" :theme="theme">Disabled</Button>
    <Button :left-icon="mdiPencil" :theme="theme">With Icon</Button>
    <Button :right-icon="mdiMenuDown" :theme="theme">Dropdown</Button>
    <ButtonGroup>
        <Button :theme="theme">Split</Button>
        <IconButton label="More" :icon="mdiMenuDown" :theme="theme" />
    </ButtonGroup>
    <IconButton label="Add" :icon="mdiPlus" :theme="theme" />
</template>

<script setup lang="ts">
import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, ButtonGroup, IconButton, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
