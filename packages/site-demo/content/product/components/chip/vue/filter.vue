<template>
    <Chip
        :theme="theme"
        :is-selected="isSelected"
        @click="onClick"
        @after-click="onAfterClick"
    >
        <template #after>
            <Icon v-if="isSelected" :icon="mdiCloseCircle" size="xs" />
            <Icon v-else :icon="mdiMenuDown" size="xs" />
        </template>
        Filter
    </Chip>

    <Chip
        :theme="theme"
        :is-selected="isSelected"
        @click="onClick"
        @after-click="onAfterClick"
    >
        <template #before>
            <Icon :icon="mdiFilterVariant" size="xs" />
        </template>
        <template #after>
            <Icon v-if="isSelected" :icon="mdiCloseCircle" size="xs" />
            <Icon v-else :icon="mdiMenuDown" size="xs" />
        </template>
        Filter rich
    </Chip>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiCloseCircle, mdiFilterVariant, mdiMenuDown } from '@lumx/icons';
import { Chip, Icon, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const isSelected = ref(false);
const onClick = () => {
    if (!isSelected.value) {
        isSelected.value = true;
    }
};
const onAfterClick = () => {
    isSelected.value = !isSelected.value;
};
</script>
