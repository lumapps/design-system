<template>
    <TextField label="Textfield label" :is-disabled="true" :theme="theme" value="" />
</template>

<script setup lang="ts">
import { TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
