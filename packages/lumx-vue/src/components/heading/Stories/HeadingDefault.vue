<template>
    <Heading v-bind="$attrs">
        <slot />
    </Heading>
</template>

<script setup lang="ts">
import { Heading } from '@lumx/vue';
</script>
