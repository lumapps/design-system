<template>
    <SelectButton
        label="Select a fruit"
        :options="items"
        get-option-id="id"
        get-option-name="name"
        :value="value"
        @change="handleChange"
        @load-more="onLoadMore"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectButton } from '@lumx/vue';

interface Fruit {
    id: string;
    name: string;
    category?: string;
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

// Start with 3 pages so the popover overflows and the IntersectionObserver
// sentinel doesn't fire before the user scrolls.
const initialItems: Fruit[] = Array.from({ length: 3 }).flatMap((_, page) =>
    FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${page * FRUITS.length + i}` })),
);

const value = ref<Fruit>();
const items = ref<Fruit[]>(initialItems);

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
