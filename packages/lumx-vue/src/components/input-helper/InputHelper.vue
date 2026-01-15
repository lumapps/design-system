<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { InputHelper as UI, InputHelperProps } from '@lumx/core/js/components/InputHelper';

const props = defineProps<InputHelperProps>();
const attrs = useAttrs();

const defaultTheme = inject('theme', undefined);
</script>

<template>
  <UI v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }">
    <slot />
  </UI>
</template>
