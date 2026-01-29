<template>
    <Button :theme="theme">Button</Button>
</template>

<script setup lang="ts">
import { Button, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
