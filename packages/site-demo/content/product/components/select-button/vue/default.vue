<template>
    <SelectButton label="Select a fruit" :options="FRUITS" :get-option-id="String" v-model:value="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectButton } from '@lumx/vue';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange', 'Peach', 'Strawberry'];

const value = ref<string | undefined>();
</script>
