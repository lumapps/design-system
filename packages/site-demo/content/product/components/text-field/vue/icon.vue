<template>
    <TextField :value="value" :icon="mdiMagnify" :theme="theme" @change="value = $event" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiMagnify } from '@lumx/icons';
import { TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref('');
</script>
