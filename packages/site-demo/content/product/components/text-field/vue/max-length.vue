<template>
    <TextField
        label="Text field label"
        :value="value"
        :max-length="50"
        :theme="theme"
        :char-counter-message="charCounterMessage"
        @change="value = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref('');

const charCounterMessage = (n: number) => `${n} characters remaining`;
</script>
