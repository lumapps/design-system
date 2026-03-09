<template>
    <TextField label="Text field label" :value="value" :max-length="50" :theme="theme" @change="value = $event" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref('');
</script>
