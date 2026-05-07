<template>
    <SelectButton
        selection-type="multiple"
        label="Select fruits"
        :options="FRUITS"
        get-option-id="id"
        get-option-name="name"
        :value="value"
        @change="(newValue) => (value = newValue ?? [])"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectButton } from '@lumx/vue';

const FRUITS = [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'cherry', name: 'Cherry' },
    { id: 'grape', name: 'Grape' },
    { id: 'orange', name: 'Orange' },
    { id: 'peach', name: 'Peach' },
    { id: 'strawberry', name: 'Strawberry' },
];

const value = ref([FRUITS[0], FRUITS[2]]);
</script>
