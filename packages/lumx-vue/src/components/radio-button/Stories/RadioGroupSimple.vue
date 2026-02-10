<template>
    <RadioGroupDefaultVue>
        <RadioButton
            :is-checked="selectedValue === 'lorem'"
            :helper="loremIpsum('tiny')"
            label="Radio button with help 1"
            name="test"
            value="lorem"
            @change="handleChange"
        />
        <RadioButton
            :is-disabled="true"
            :helper="loremIpsum('tiny')"
            label="Radio button with help 2"
            name="test"
            value="ipsum"
            @change="handleChange"
        />
        <RadioButton
            :is-checked="selectedValue === 'dolor'"
            :helper="loremIpsum('tiny')"
            label="Radio button with help 3"
            name="test"
            value="dolor"
            @change="handleChange"
        />
    </RadioGroupDefaultVue>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RadioButton } from '@lumx/vue';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import RadioGroupDefaultVue from './RadioGroupDefault.vue';

const selectedValue = ref('lorem');

const handleChange = (value?: string) => {
    if (value !== undefined) {
        selectedValue.value = value;
    }
};
</script>
