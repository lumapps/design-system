<template>
    <SelectTextField
        selection-type="multiple"
        label="Select fruits"
        placeholder="Search fruits..."
        :options="fruits"
        filter="auto"
        get-option-id="id"
        get-option-name="name"
        get-section-id="category"
        :value="value"
        :search-input-value="search"
        :translations="TRANSLATIONS"
        @change="value = $event ?? []"
        @search="search = $event"
    >
        <template v-if="canCreate" #beforeOptions>
            <SelectTextFieldSection>
                <SelectTextFieldOption :value="`__create__${search}`" @click="handleCreate(search)">
                    Create "{{ search }}"
                </SelectTextFieldOption>
            </SelectTextFieldSection>
        </template>

        <template #option="{ option }">
            <SelectTextFieldOption :value="option.id">
                <template #before>
                    <Icon :icon="option.icon" size="xs" />
                </template>
                {{ option.name }}
            </SelectTextFieldOption>
        </template>

        <template #sectionTitle="{ sectionId, options }">
            <Icon :icon="options[0].categoryIcon" size="xs" />
            {{ sectionId }}
        </template>

        <template #chip="{ option }">
            <Chip>
                <template #before>
                    <Icon :icon="option.icon" size="xs" />
                </template>
                {{ option.name }}
            </Chip>
        </template>
    </SelectTextField>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Chip, Icon, SelectTextField, SelectTextFieldOption, SelectTextFieldSection } from '@lumx/vue';
import {
    mdiFoodApple,
    mdiFoodForkDrink,
    mdiFruitCitrus,
    mdiFruitGrapes,
    mdiFruitPineapple,
    mdiSprout,
} from '@lumx/icons';

interface Fruit {
    id: string;
    name: string;
    icon: string;
    category: string;
    categoryIcon: string;
}

const INITIAL_FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple', icon: mdiFoodApple, category: 'Pome', categoryIcon: mdiFoodApple },
    { id: 'banana', name: 'Banana', icon: mdiSprout, category: 'Tropical', categoryIcon: mdiFruitPineapple },
    {
        id: 'pineapple',
        name: 'Pineapple',
        icon: mdiFruitPineapple,
        category: 'Tropical',
        categoryIcon: mdiFruitPineapple,
    },
    { id: 'grape', name: 'Grape', icon: mdiFruitGrapes, category: 'Berry', categoryIcon: mdiFruitGrapes },
    { id: 'lemon', name: 'Lemon', icon: mdiFruitCitrus, category: 'Citrus', categoryIcon: mdiFruitCitrus },
    { id: 'orange', name: 'Orange', icon: mdiFruitCitrus, category: 'Citrus', categoryIcon: mdiFruitCitrus },
];

const TRANSLATIONS = {
    showSuggestionsLabel: 'Show suggestions',
    chipGroupLabel: 'Selected fruits',
    chipRemoveLabel: 'Remove',
};

const value = ref<Fruit[]>([INITIAL_FRUITS[1], INITIAL_FRUITS[3]]);
const search = ref('');
const fruits = ref(INITIAL_FRUITS);

const canCreate = computed(
    () => search.value && !fruits.value.some((f) => f.name.toLowerCase() === search.value.toLowerCase()),
);

function handleCreate(name: string) {
    const newFruit: Fruit = {
        id: name.toLowerCase(),
        name,
        icon: mdiFoodForkDrink,
        category: 'Custom',
        categoryIcon: mdiFoodForkDrink,
    };
    fruits.value = [...fruits.value, newFruit];
    value.value = [...value.value, newFruit];
    search.value = '';
}
</script>
