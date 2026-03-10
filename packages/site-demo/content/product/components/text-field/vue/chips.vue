<template>
    <TextField :value="value" :theme="theme" @change="value = $event">
        <template #chips>
            <ChipGroup>
                <Chip size="s">First</Chip>
                <Chip size="s">Second</Chip>
                <Chip size="s">Third</Chip>
            </ChipGroup>
        </template>
    </TextField>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Chip, ChipGroup, TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const value = ref('');
</script>
