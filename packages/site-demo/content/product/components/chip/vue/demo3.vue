<template>
    <Chip :theme="theme" :is-selected="selected === 0" @click="() => toggleSelection(0)">Am</Chip>

    <Chip :theme="theme" :is-selected="selected === 1" @click="() => toggleSelection(1)">Stram</Chip>

    <Chip :theme="theme" :is-selected="selected === 2" @click="() => toggleSelection(2)">Gram</Chip>

    <Chip :theme="theme" :is-selected="selected === 3" @click="() => toggleSelection(3)">Pic</Chip>

    <Chip :theme="theme" :is-selected="selected === 4" @click="() => toggleSelection(4)">Pic</Chip>

    <Chip :theme="theme" :is-selected="selected === 5" @click="() => toggleSelection(5)">Colegram</Chip>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Chip, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const selected = ref(-1);
const toggleSelection = (index: number) => {
    selected.value = selected.value === index ? -1 : index;
};
</script>
