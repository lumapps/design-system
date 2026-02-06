<template>
    <InputLabel v-bind="$attrs" html-for="storybook">
        <slot />
    </InputLabel>
</template>

<script setup lang="ts">
import { InputLabel } from '@lumx/vue';
</script>
