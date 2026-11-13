<template>
    <DatePicker
        :value="datePicked"
        locale="en"
        :next-button-props="{ label: 'Next month' }"
        :previous-button-props="{ label: 'Previous month' }"
        @change="datePicked = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@lumx/vue';

const props = defineProps<{ today?: Date }>();
const datePicked = ref<Date | undefined>(props.today ?? new Date());
</script>
