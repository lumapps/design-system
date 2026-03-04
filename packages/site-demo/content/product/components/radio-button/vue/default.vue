<template>
    <RadioGroup>
        <RadioButton
            :is-checked="value === 'lorem'"
            label="Radio button"
            name="test1"
            :theme="theme"
            value="lorem"
            @change="value = $event"
        />

        <RadioButton
            :is-checked="value === 'ipsum'"
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
            label="Radio button with help"
            name="test1"
            :theme="theme"
            value="ipsum"
            @change="value = $event"
        />

        <RadioButton
            :is-checked="value === 'dolor'"
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
            label="Disabled radio button with help"
            name="test1"
            :theme="theme"
            value="dolor"
            @change="value = $event"
            :is-disabled="true"
        />
    </RadioGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RadioButton, RadioGroup, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref<string | undefined>('lorem');
</script>
