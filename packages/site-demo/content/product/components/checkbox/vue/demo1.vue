<template>
    <Checkbox label="Checkbox" :is-checked="checked1" :theme="theme" @change="checked1 = $event" />

    <Checkbox
        label="Checkbox with help"
        helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        :is-checked="checked2"
        :theme="theme"
        @change="checked2 = $event"
    />

    <Checkbox
        label="Disabled checkbox with help"
        helper="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        :is-disabled="true"
        :theme="theme"
    />

    <Checkbox label="Checkbox intermediate state" :is-checked="checked3" :theme="theme" @change="checked3 = $event" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const checked1 = ref<boolean | 'intermediate'>(true);
const checked2 = ref<boolean | 'intermediate'>(false);
const checked3 = ref<boolean | 'intermediate'>('intermediate');
</script>
