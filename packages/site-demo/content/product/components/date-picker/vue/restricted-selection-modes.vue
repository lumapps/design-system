<template>
    <DatePicker
        :value="datePicked"
        locale="en"
        :min-date="minDate"
        :next-button-props="{ label: 'Next month' }"
        :previous-button-props="{ label: 'Previous month' }"
        @change="datePicked = $event"
    />
    <DatePicker
        :value="datePicked"
        locale="en"
        :max-date="maxDate"
        :next-button-props="{ label: 'Next month' }"
        :previous-button-props="{ label: 'Previous month' }"
        @change="datePicked = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@lumx/vue';

const props = defineProps<{ today?: Date }>();
const today = props.today ?? new Date();
const maxDate = new Date(today);
const minDate = new Date(today);
minDate.setDate(minDate.getDate() - 1);

const datePicked = ref<Date | undefined>(maxDate);
</script>
