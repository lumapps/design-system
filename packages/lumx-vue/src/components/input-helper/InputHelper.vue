<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { InputHelper as UI, InputHelperProps } from '@lumx/core/js/components/InputHelper';
import { Theme } from '@lumx/core/js/constants';

const props = defineProps<InputHelperProps>();
const attrs = useAttrs();

const defaultTheme = inject('theme', undefined) || Theme.light;
</script>

<template>
  <UI v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }">
    <slot />
  </UI>
</template>
