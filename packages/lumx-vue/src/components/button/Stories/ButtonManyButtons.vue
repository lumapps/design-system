<template>
    <ButtonGroup v-bind="$attrs">
        <span class="visually-hidden">Ignore me</span>
        <Button emphasis="medium">Button 1</Button>
        <span class="visually-hidden">Ignore me</span>
        <Button emphasis="medium">Button 2</Button>
        <span class="visually-hidden">Ignore me</span>
    </ButtonGroup>
</template>

<script setup lang="ts">
import { ButtonGroup, Button } from '@lumx/vue';
</script>
