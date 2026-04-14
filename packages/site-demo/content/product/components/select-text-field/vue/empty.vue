<template>
    <SelectTextField
        selection-type="single"
        label="Select a fruit"
        placeholder="Search fruits..."
        :options="[]"
        filter="auto"
        get-option-id="id"
        get-option-name="name"
        :value="value"
        :translations="TRANSLATIONS"
        @change="value = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectTextField } from '@lumx/vue';

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
    emptyMessage: 'No options available',
};

const value = ref<{ id: string; name: string } | undefined>();
</script>
