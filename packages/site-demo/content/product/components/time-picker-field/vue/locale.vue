<template>
    <TimePickerField
        label="Heure"
        locale="fr-FR"
        :value="value"
        :translations="TRANSLATIONS"
        @change="value = $event"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TimePickerField } from '@lumx/vue';

const TRANSLATIONS = {
    clearLabel: 'Effacer',
    showSuggestionsLabel: 'Afficher les suggestions',
};

const at = (hour: number, minute = 0) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
};

const value = ref<Date | undefined>(at(14, 30));
</script>
