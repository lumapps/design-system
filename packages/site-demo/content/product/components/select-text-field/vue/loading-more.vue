<template>
    <SelectTextField
        selection-type="single"
        label="Select a fruit"
        placeholder="Search fruits..."
        :options="FRUITS"
        filter="auto"
        get-option-id="id"
        get-option-name="name"
        :value="value"
        list-status="loadingMore"
        :translations="TRANSLATIONS"
        @change="value = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectTextField } from '@lumx/vue';

const FRUITS = [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'cherry', name: 'Cherry' },
];

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
    loadingMessage: 'Loading more options...',
};

const value = ref<(typeof FRUITS)[number] | undefined>();
</script>
