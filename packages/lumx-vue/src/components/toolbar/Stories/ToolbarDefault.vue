<template>
    <Toolbar v-bind="$attrs">
        <slot />
    </Toolbar>
</template>

<script setup lang="ts">
import { Toolbar } from '@lumx/vue';
</script>
