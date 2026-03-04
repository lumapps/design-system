<template>
    <Switch :is-checked="state" :theme="theme" @change="state = $event"> Default </Switch>

    <Switch :is-checked="state" :theme="theme" helper="Helper text" @change="state = $event"> With helper </Switch>

    <Switch :is-disabled="true" :is-checked="state" :theme="theme" @change="state = $event"> Disabled </Switch>

    <Switch :is-checked="true" :is-disabled="true" :theme="theme"> Disabled checked </Switch>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Switch, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const state = ref(false);
</script>
