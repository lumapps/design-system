<template>
    <SelectList
        aria-label="Fruits"
        :options="FRUITS"
        get-option-id="id"
        get-option-name="name"
        get-section-id="category"
        :value="value"
        @change="handleChange"
    >
        <!-- Customize section title with an icon -->
        <template #sectionTitle="{ sectionId, options }">
            <Icon :icon="options[0].categoryIcon" size="xs" />
            {{ sectionId }}
        </template>

        <!-- Customize option render with an icon -->
        <template #option="{ option }">
            <SelectListOption :value="option.id">
                <template #before>
                    <Icon :icon="option.icon" size="xs" />
                </template>
                {{ option.name }}
            </SelectListOption>
        </template>
    </SelectList>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FRUITS, type Fruit } from '@lumx/core/js/components/SelectButton/Stories';
import { SelectList, SelectListOption, Icon } from '@lumx/vue';

const value = ref<Fruit>();

function handleChange(newValue: Fruit | undefined) {
    value.value = newValue;
}
</script>
