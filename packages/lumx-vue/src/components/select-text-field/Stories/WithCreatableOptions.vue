<template>
    <SelectTextField
        selection-type="multiple"
        label="Select or create a fruit"
        placeholder="Type to search or create..."
        :options="options"
        filter="auto"
        :get-option-id="String"
        :value="value"
        :search-input-value="search"
        :translations="CREATABLE_TRANSLATIONS"
        @change="value = $event ?? []"
        @search="search = $event"
    >
        <template v-if="canCreate" #beforeOptions>
            <SelectTextField.Section>
                <SelectTextField.Option :value="`__create__${search}`" @click="handleCreate(search)">
                    Create "{{ search }}"
                </SelectTextField.Option>
            </SelectTextField.Section>
        </template>
    </SelectTextField>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { SelectTextField } from '@lumx/vue';

const CREATABLE_TRANSLATIONS = {
    ...TRANSLATIONS,
    chipGroupLabel: 'Selected fruits',
};

const value = ref<string[]>([]);
const search = ref('');
const options = ref(['Apple', 'Banana', 'Cherry', 'Orange']);

const canCreate = computed(
    () => search.value && !options.value.some((o) => o.toLowerCase() === search.value.toLowerCase()),
);

function handleCreate(name: string) {
    if (!options.value.includes(name)) {
        options.value = [...options.value, name];
    }
    value.value = [...value.value, name];
    search.value = '';
}
</script>
