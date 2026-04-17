<template>
    <SelectTextField
        selection-type="single"
        label="Select a fruit"
        placeholder="Search fruits..."
        :options="items"
        filter="auto"
        get-option-id="id"
        get-option-name="name"
        :value="value"
        :translations="TRANSLATIONS"
        @change="value = $event"
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
const items = ref<Fruit[]>(FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${i}` })));

function onLoadMore() {
    if (items.value.length >= 200) {
        return;
    }
    const offset = items.value.length;
    items.value = [...items.value, ...FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${offset + i}` }))];
}
</script>
