<template>
    <Button emphasis="medium" :theme="theme">Default</Button>
    <Button disabled="true" emphasis="medium" :theme="theme">Disabled</Button>
    <Button :left-icon="mdiPencil" emphasis="medium" :theme="theme">With Icon</Button>
    <Button :right-icon="mdiMenuDown" emphasis="medium" :theme="theme">Dropdown</Button>
    <ButtonGroup>
        <Button emphasis="medium" :theme="theme">Split</Button>
        <IconButton label="More" emphasis="medium" :icon="mdiMenuDown" :theme="theme" />
    </ButtonGroup>
    <IconButton label="Add" emphasis="medium" :icon="mdiPlus" :theme="theme" />
</template>

<script setup lang="ts">
import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, ButtonGroup, IconButton, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
