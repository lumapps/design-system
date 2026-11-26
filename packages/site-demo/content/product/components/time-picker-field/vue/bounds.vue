<template>
    <TimePickerField
        v-model:value="value"
        label="Working hours"
        helper="Pick a time between 9:00 and 18:00"
        locale="en-US"
        :min-time="minTime"
        :max-time="maxTime"
        :translations="TRANSLATIONS"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TimePickerField } from '@lumx/vue';

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

const at = (hour: number, minute: number) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
};

const minTime = at(9, 0);
const maxTime = at(18, 0);
const value = ref<Date | undefined>(at(10, 0));
</script>
