<template>
    <SelectionChipGroup
        :value="fruits"
        get-option-id="id"
        label="Selected fruits"
        chip-remove-label="Remove"
        @change="fruits = $event ?? []"
    >
        <template #chip="{ option }">
            <Chip>
                <template #before>
                    <Icon :icon="option.icon" size="xs" />
                </template>
                {{ option.name }}
            </Chip>
        </template>
    </SelectionChipGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiFoodApple, mdiFruitCherries, mdiFruitCitrus, mdiFruitGrapes, mdiFruitWatermelon } from '@lumx/icons';
import { Chip, Icon, SelectionChipGroup } from '@lumx/vue';

const fruits = ref([
    { id: 'Apple', icon: mdiFoodApple },
    { id: 'Cherries', icon: mdiFruitCherries },
    { id: 'Citrus', icon: mdiFruitCitrus },
    { id: 'Grapes', icon: mdiFruitGrapes },
    { id: 'Watermelon', icon: mdiFruitWatermelon },
]);
</script>
