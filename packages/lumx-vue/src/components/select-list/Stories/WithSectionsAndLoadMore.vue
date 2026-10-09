<template>
    <SelectList
        aria-label="Fruits"
        :options="options"
        get-option-id="id"
        get-option-name="name"
        get-section-id="category"
        :value="value"
        @change="handleChange"
        @load-more="onLoadMore"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FRUITS, type Fruit } from '@lumx/core/js/components/SelectButton/Stories';
import { SelectList } from '@lumx/vue';

const value = ref<Fruit>();
const options = ref<Fruit[]>(FRUITS);

function handleChange(newValue: Fruit | undefined) {
    value.value = newValue;
}

function onLoadMore() {
    // Stop after 3 pages (the sentinel stays rendered)
    if (options.value.length >= FRUITS.length * 3) return;
    const page = options.value.length / FRUITS.length;
    options.value = [
        ...options.value,
        ...FRUITS.map((f) => ({ ...f, id: `${f.id}-${page}`, name: `${f.name} ${page + 1}` })),
    ];
}
</script>
