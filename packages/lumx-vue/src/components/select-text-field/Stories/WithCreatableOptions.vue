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
        :translations="MULTI_TRANSLATIONS"
        @change="handleChange"
        @search="search = $event"
    >
        <template v-if="canCreate" #beforeOptions>
            <SelectTextFieldSection>
                <SelectTextFieldOption :value="`__create__${search}`" @click="handleCreate(search)">
                    Create "{{ search }}"
                </SelectTextFieldOption>
            </SelectTextFieldSection>
        </template>
    </SelectTextField>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { MULTI_TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { SelectTextField, SelectTextFieldOption, SelectTextFieldSection } from '@lumx/vue';

const value = ref<string[]>([]);
const search = ref('');
const options = ref(['Apple', 'Banana', 'Cherry', 'Orange']);

function handleChange(newValue: string[] | undefined) {
    value.value = newValue ?? [];
}

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
