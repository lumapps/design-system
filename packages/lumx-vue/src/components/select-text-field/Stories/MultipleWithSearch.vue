<template>
    <SelectTextField
        selection-type="multiple"
        label="Select fruits"
        placeholder="Type to search..."
        :options="filteredFruits"
        filter="manual"
        get-option-id="id"
        get-option-name="name"
        :value="value"
        :translations="MULTI_SEARCH_TRANSLATIONS"
        @change="value = $event ?? []"
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

const MULTI_SEARCH_TRANSLATIONS = {
    ...TRANSLATIONS,
    chipGroupLabel: 'Selected fruits',
};

const value = ref<Fruit[]>([]);
const filteredFruits = ref(FRUITS);

function handleSearch(searchText: string) {
    if (!searchText) {
        filteredFruits.value = FRUITS;
        return;
    }
    const lower = searchText.toLowerCase();
    filteredFruits.value = FRUITS.filter((f) => f.name.toLowerCase().includes(lower));
}
</script>
