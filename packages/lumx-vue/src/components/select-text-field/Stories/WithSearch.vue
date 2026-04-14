<template>
    <SelectTextField
        selection-type="single"
        label="Select a fruit"
        placeholder="Type to search..."
        :options="filteredFruits"
        filter="manual"
        get-option-id="id"
        get-option-name="name"
        :value="value"
        :translations="TRANSLATIONS"
        @change="handleChange"
        @search="handleSearch"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { SelectTextField } from '@lumx/vue';

interface Fruit {
    id: string;
    name: string;
}

const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple' },
    { id: 'apricot', name: 'Apricot' },
    { id: 'banana', name: 'Banana' },
    { id: 'blueberry', name: 'Blueberry' },
    { id: 'cherry', name: 'Cherry' },
    { id: 'grape', name: 'Grape' },
    { id: 'lemon', name: 'Lemon' },
    { id: 'orange', name: 'Orange' },
    { id: 'peach', name: 'Peach' },
    { id: 'strawberry', name: 'Strawberry' },
];

const value = ref<Fruit>();
const filteredFruits = ref(FRUITS);

function handleChange(newValue: Fruit | undefined) {
    value.value = newValue;
}

function handleSearch(searchText: string) {
    if (!searchText) {
        filteredFruits.value = FRUITS;
        return;
    }
    const lower = searchText.toLowerCase();
    filteredFruits.value = FRUITS.filter((f) => f.name.toLowerCase().includes(lower));
}
</script>
