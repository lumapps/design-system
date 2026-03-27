<template>
    <SelectButton
        label="Select a fruit"
        :options="FRUITS"
        get-option-id="id"
        get-option-name="name"
        get-section-id="category"
        :value="value"
        @change="handleChange"
    >
        <!-- Use a Chip as the button trigger -->
        <template #button="{ buttonProps, children }">
            <Chip v-bind="buttonProps" :is-clickable="true" :is-selected="!!value">
                {{ children }}
                <template #after>
                    <Icon :icon="mdiMenuDown" />
                </template>
            </Chip>
        </template>

        <!-- Customize section title with an icon -->
        <template #sectionTitle="{ sectionId, options }">
            <Icon :icon="options[0].categoryIcon" size="xs" />
            {{ sectionId }}
        </template>

        <!-- Customize option render with an icon -->
        <template #option="{ option }">
            <SelectButtonOption :value="option.id">
                <template #before>
                    <Icon :icon="option.icon" size="xs" />
                </template>
                {{ option.name }}
            </SelectButtonOption>
        </template>
    </SelectButton>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiMenuDown } from '@lumx/icons';
import { FRUITS, type Fruit } from '@lumx/core/js/components/SelectButton/Stories';
import { SelectButton, SelectButtonOption, Chip, Icon } from '@lumx/vue';

const value = ref<Fruit>();

function handleChange(newValue: Fruit | undefined) {
    value.value = newValue;
}
</script>
