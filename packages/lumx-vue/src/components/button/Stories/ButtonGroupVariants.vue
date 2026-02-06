<template>
    <ButtonGroup>
        <Button :size="$attrs.size" :emphasis="$attrs.emphasis" :theme="$attrs.theme">Button</Button>
        <IconButton
            :size="$attrs.size"
            :emphasis="$attrs.emphasis"
            :theme="$attrs.theme"
            label="IconButton"
            :icon="mdiMenuDown"
        />
    </ButtonGroup>
</template>

<script setup lang="ts">
import { ButtonGroup, Button, IconButton } from '@lumx/vue';
import { mdiMenuDown } from '@lumx/icons';
</script>
