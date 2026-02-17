<template>
    <Toolbar v-bind="$attrs">
        <template #before>
            <Icon :icon="mdiMenu" />
        </template>
        Page title
    </Toolbar>
</template>

<script setup lang="ts">
import { Toolbar, Icon } from '@lumx/vue';
import { mdiMenu } from '@lumx/icons';
</script>
