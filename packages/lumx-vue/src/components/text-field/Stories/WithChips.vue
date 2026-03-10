<template>
    <TextField v-bind="$attrs">
        <template #chips>
            <Chip size="s">Chip 1</Chip>
            <Chip size="s">Chip 2</Chip>
        </template>
    </TextField>
</template>

<script setup lang="ts">
import { Chip, TextField } from '@lumx/vue';

defineOptions({ inheritAttrs: false });
</script>
