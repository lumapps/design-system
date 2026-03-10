<template>
    <TextField
        label="Text area label"
        :value="value"
        :multiline="true"
        :is-valid="true"
        :theme="theme"
        @change="value = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref('Valid value');
</script>
