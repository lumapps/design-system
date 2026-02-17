<template>
    <Toolbar v-bind="$attrs">
        <template #after>
            <Icon :icon="mdiMagnify" />
            <Icon :icon="mdiDotsVertical" />
        </template>
        Page title
    </Toolbar>
</template>

<script setup lang="ts">
import { Toolbar, Icon } from '@lumx/vue';
import { mdiMagnify, mdiDotsVertical } from '@lumx/icons';
</script>
