<template>
    <Switch v-model:is-checked="state" :theme="theme"> Default </Switch>

    <Switch v-model:is-checked="state" :theme="theme" helper="Helper text"> With helper </Switch>

    <Switch :is-disabled="true" :is-checked="state" :theme="theme" @change="state = $event"> Disabled </Switch>

    <Switch :is-checked="true" :is-disabled="true" :theme="theme"> Disabled checked </Switch>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Switch, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const state = ref(false);
</script>
