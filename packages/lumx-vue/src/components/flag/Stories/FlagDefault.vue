<template>
    <Flag v-bind="$attrs">
        <slot />
    </Flag>
</template>

<script setup lang="ts">
import { Flag } from '@lumx/vue';
</script>
