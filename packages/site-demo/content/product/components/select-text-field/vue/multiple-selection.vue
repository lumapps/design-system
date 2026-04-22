<template>
    <SelectTextField
        selection-type="multiple"
        label="Select fruits"
        placeholder="Search fruits..."
        :options="FRUITS"
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

interface Fruit {
    id: string;
    name: string;
}

const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'cherry', name: 'Cherry' },
    { id: 'grape', name: 'Grape' },
    { id: 'orange', name: 'Orange' },
    { id: 'peach', name: 'Peach' },
    { id: 'strawberry', name: 'Strawberry' },
];

const TRANSLATIONS = {
    showSuggestionsLabel: 'Show suggestions',
    chipGroupLabel: 'Selected fruits',
    chipRemoveLabel: 'Remove',
};

const value = ref<Fruit[] | undefined>([FRUITS[0], FRUITS[2]]);
</script>
