<template>
    <Toolbar v-bind="$attrs">
        <template #before>
            <Icon :icon="mdiMenu" />
        </template>
        Page title
        <template #after>
            <Icon :icon="mdiMagnify" />
            <Icon :icon="mdiDotsVertical" />
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { Toolbar, Icon } from '@lumx/vue';
import { mdiMenu, mdiMagnify, mdiDotsVertical } from '@lumx/icons';
</script>
