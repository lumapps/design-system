<template>
    <InputHelper v-bind="$attrs">
        <slot />
    </InputHelper>
</template>

<script setup lang="ts">
import { InputHelper } from '@lumx/vue';
</script>
