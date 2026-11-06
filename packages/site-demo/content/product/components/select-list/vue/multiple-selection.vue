<template>
    <SelectList
        selection-type="multiple"
        aria-label="Fruits"
        :options="FRUITS"
        :get-option-id="String"
        :value="value"
        @change="(newValue) => (value = newValue)"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectList } from '@lumx/vue';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange'];

const value = ref<string[]>(['Banana', 'Grape']);
</script>
