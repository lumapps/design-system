<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { InputHelper as UI } from '@lumx/core/js/components/InputHelper';

// Define props (replace 'any' with actual IconProps type if available)
const props = defineProps();
const attrs = useAttrs();
// Inject theme if provided by parent
const defaultTheme = inject('theme', undefined);
</script>

<template>
  <UI v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }">
    <slot />
  </UI>
</template>
