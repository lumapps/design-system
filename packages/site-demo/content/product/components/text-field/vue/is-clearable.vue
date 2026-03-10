<template>
    <TextField
        label="Text field label"
        :value="value"
        :clear-button-props="{ label: 'Clear' }"
        :theme="theme"
        @change="value = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref('Clearable value');
</script>
