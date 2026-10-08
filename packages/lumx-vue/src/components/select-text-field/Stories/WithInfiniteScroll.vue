<template>
    <SelectTextField
        selection-type="single"
        label="Select a fruit"
        placeholder="Search fruits..."
        :options="items"
        filter="auto"
        get-option-id="id"
        get-option-name="name"
        get-section-id="category"
        :value="value"
        :translations="TRANSLATIONS"
        @change="handleChange"
        @load-more="onLoadMore"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { SelectTextField } from '@lumx/vue';

interface Fruit {
    id: string;
    name: string;
    category: string;
}

const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple', category: 'Pome' },
    { id: 'apricot', name: 'Apricot', category: 'Stone' },
    { id: 'banana', name: 'Banana', category: 'Tropical' },
    { id: 'blueberry', name: 'Blueberry', category: 'Berry' },
    { id: 'cherry', name: 'Cherry', category: 'Stone' },
    { id: 'grape', name: 'Grape', category: 'Berry' },
    { id: 'lemon', name: 'Lemon', category: 'Citrus' },
    { id: 'orange', name: 'Orange', category: 'Citrus' },
    { id: 'peach', name: 'Peach', category: 'Stone' },
    { id: 'strawberry', name: 'Strawberry', category: 'Berry' },
];

const value = ref<Fruit>();
const items = ref<Fruit[]>(FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${i}` })));

function handleChange(newValue: Fruit | undefined) {
    value.value = newValue;
}

function onLoadMore() {
    if (items.value.length >= 200) {
        return;
    }
    const offset = items.value.length;
    items.value = [...items.value, ...FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${offset + i}` }))];
}
</script>
