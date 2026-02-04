<template>
    <InputLabel v-bind="$attrs">
        <slot />
    </InputLabel>
</template>

<script setup lang="ts">
import { InputLabel } from '@lumx/vue';
</script>
