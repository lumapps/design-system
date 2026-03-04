<template>
    <Toolbar>
        <Heading typography="title">Toolbar title</Heading>
        <template #after>
            <IconButton label="Search" emphasis="low" :icon="mdiMagnify" />
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { mdiMagnify } from '@lumx/icons';
import { IconButton, Toolbar, Heading } from '@lumx/vue';
</script>
