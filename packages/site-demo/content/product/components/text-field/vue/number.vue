<template>
    <TextField label="Number" :value="value" type="number" :theme="theme" @change="value = $event" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref('');
</script>
