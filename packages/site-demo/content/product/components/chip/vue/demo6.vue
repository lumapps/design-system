<template>
    <!-- ChipGroup not yet available in @lumx/vue, using flex container -->
    <div style="display: flex; flex-wrap: wrap; gap: var(--lumx-spacing-unit-tiny)">
        <Chip :theme="theme" size="s">Apricot</Chip>
        <Chip :theme="theme" size="s">Apple</Chip>
        <Chip :theme="theme" size="s">Banana</Chip>
        <Chip :theme="theme" size="s">Blueberry</Chip>
        <Chip :theme="theme" size="s">Lemon</Chip>
        <Chip :theme="theme" size="s">Orange</Chip>
        <Chip :theme="theme" size="s">Peach</Chip>
        <Chip :theme="theme" size="s">Pear</Chip>
        <Chip :theme="theme" size="s">Pineapple</Chip>
        <Chip :theme="theme" size="s">Melon</Chip>
        <Chip :theme="theme" size="s">Raspberry</Chip>
        <Chip :theme="theme" size="s">Strawberry</Chip>
        <Chip :theme="theme" size="s">Watermelon</Chip>
    </div>
</template>

<script setup lang="ts">
import { Chip, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
