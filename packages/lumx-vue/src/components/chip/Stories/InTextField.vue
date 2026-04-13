<template>
    <TextField label="Fruits" :input-ref="onInputRef">
        <template #chips>
            <SelectionChipGroup
                :value="fruits"
                get-option-id="id"
                get-option-name="name"
                label="Selected fruits"
                chip-remove-label="Remove"
                :input-ref="inputEl"
                @change="fruits = $event ?? []"
            />
        </template>
    </TextField>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectionChipGroup, TextField } from '@lumx/vue';

const fruits = ref([
    { id: '1', name: 'Apricot' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Banana' },
]);

const inputEl = ref<HTMLInputElement | null>(null);
const onInputRef = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
    inputEl.value = el as HTMLInputElement | null;
};
</script>
