<template>
    <Message v-bind="$attrs">
        <slot />
    </Message>
</template>

<script setup lang="ts">
import { Message } from '@lumx/vue';
</script>
