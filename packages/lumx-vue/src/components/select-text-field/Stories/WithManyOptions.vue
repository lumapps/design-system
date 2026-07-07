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
        @change="handleChange"
    />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { createManyOptions } from '@lumx/core/js/components/SelectTextField/TestStories';
import { SelectTextField } from '@lumx/vue';

type Fruit = ReturnType<typeof createManyOptions>[number];

const props = defineProps<{ optionsCount: number }>();

const value = ref<Fruit>();
const items = computed<Fruit[]>(() => createManyOptions(props.optionsCount));

function handleChange(newValue: Fruit | undefined) {
    value.value = newValue;
}
</script>
