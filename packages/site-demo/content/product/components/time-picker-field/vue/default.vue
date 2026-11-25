<template>
    <TimePickerField v-model:value="value" label="Time" :translations="TRANSLATIONS" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TimePickerField } from '@lumx/vue';

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

const value = ref<Date | undefined>();
</script>
