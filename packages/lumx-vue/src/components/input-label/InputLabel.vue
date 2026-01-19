<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { InputLabel as UI, InputLabelProps } from '@lumx/core/js/components/InputLabel';
import { Theme } from '@lumx/core/js/constants';

const props = defineProps<InputLabelProps>();
const attrs = useAttrs();

const defaultTheme = inject('theme', undefined) || Theme.light;
</script>

<template>
  <UI v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }">
    <slot />
  </UI>
</template>
