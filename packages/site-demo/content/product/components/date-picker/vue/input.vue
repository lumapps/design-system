<template>
    <DatePickerField
        locale="en"
        label="Pick a date"
        :icon="mdiCalendar"
        :value="datePicked"
        :next-button-props="{ label: 'Next month' }"
        :previous-button-props="{ label: 'Previous month' }"
        @change="datePicked = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiCalendar } from '@lumx/icons';
import { DatePickerField } from '@lumx/vue';

const props = defineProps<{ today?: Date }>();
const datePicked = ref<Date | undefined>(props.today ?? new Date());
</script>
