<template>
    <RadioGroup v-model:value="value" name="test1">
        <RadioButton label="Radio button" :theme="theme" value="lorem" />

        <RadioButton
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
            label="Radio button with help"
            :theme="theme"
            value="ipsum"
        />

        <RadioButton
            helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere faucibus efficitur."
            label="Disabled radio button with help"
            :theme="theme"
            value="dolor"
            is-disabled
        />
    </RadioGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RadioButton, RadioGroup, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref('lorem');
</script>
