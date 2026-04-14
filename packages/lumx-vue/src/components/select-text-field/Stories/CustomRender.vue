<template>
    <SelectTextField
        selection-type="multiple"
        label="Select fruits"
        placeholder="Search fruits..."
        :options="FRUITS"
        filter="auto"
        get-option-id="id"
        get-option-name="name"
        get-section-id="category"
        :value="value"
        :translations="MULTI_TRANSLATIONS"
        @change="value = $event ?? []"
    >
        <template #chip="{ option }">
            <Chip>
                <template #before>
                    <Icon :icon="option.icon" size="xs" />
                </template>
                {{ option.name }}
            </Chip>
        </template>

        <template #sectionTitle="{ sectionId, options }">
            <Icon :icon="options[0].categoryIcon" size="xs" />
            {{ sectionId }}
        </template>

        <template #option="{ option }">
            <Combobox.Option :value="option.id">
                <template #before>
                    <Icon :icon="option.icon" size="xs" />
                </template>
                {{ option.name }}
            </Combobox.Option>
        </template>
    </SelectTextField>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FRUITS, type Fruit } from '@lumx/core/js/components/SelectTextField/Stories';
import { MULTI_TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { Chip, Combobox, Icon, SelectTextField } from '@lumx/vue';

const value = ref<Fruit[]>([FRUITS[0], FRUITS[3]]);
</script>
