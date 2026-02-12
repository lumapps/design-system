<template>
    <ButtonGroup>
        <Button v-bind="attrs">Button</Button>
        <IconButton v-bind="attrs" label="IconButton" :icon="mdiMenuDown" />
    </ButtonGroup>
</template>

<script setup lang="ts">
import { ButtonGroup, Button, IconButton } from '@lumx/vue';
import { mdiMenuDown } from '@lumx/icons';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();
</script>
