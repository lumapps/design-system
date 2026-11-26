<template>
    <Checkbox label="Checkbox" v-model:is-checked="checked1" :theme="theme" />

    <Checkbox
        label="Checkbox with help"
        helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        v-model:is-checked="checked2"
        :theme="theme"
    />

    <Checkbox
        label="Disabled checkbox with help"
        helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        is-disabled
        :theme="theme"
    />

    <Checkbox label="Checkbox intermediate state" v-model:is-checked="checked3" :theme="theme" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const checked1 = ref<boolean | 'intermediate'>(true);
const checked2 = ref<boolean | 'intermediate'>(false);
const checked3 = ref<boolean | 'intermediate'>('intermediate');
</script>
