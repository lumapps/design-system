<template>
    <SelectTextField
        selection-type="single"
        label="Select a fruit"
        placeholder="Search fruits..."
        :options="FRUITS"
        filter="auto"
        get-option-id="id"
        get-option-name="name"
        get-section-id="category"
        :value="value"
        :translations="TRANSLATIONS"
        @change="value = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectTextField } from '@lumx/vue';

const FRUITS = [
    { id: 'apple', name: 'Apple', category: 'Pome' },
    { id: 'banana', name: 'Banana', category: 'Tropical' },
    { id: 'blueberry', name: 'Blueberry', category: 'Berry' },
    { id: 'cherry', name: 'Cherry', category: 'Stone' },
    { id: 'grape', name: 'Grape', category: 'Berry' },
    { id: 'lemon', name: 'Lemon', category: 'Citrus' },
    { id: 'orange', name: 'Orange', category: 'Citrus' },
    { id: 'peach', name: 'Peach', category: 'Stone' },
    { id: 'strawberry', name: 'Strawberry', category: 'Berry' },
];

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

const value = ref<(typeof FRUITS)[number] | undefined>();
</script>
