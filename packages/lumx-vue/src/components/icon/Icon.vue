<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { Icon as UI } from '@lumx/core/js/components/Icon';
// import type { IconProps, IconSizes } from '@lumx/core/js/components/Icon';

// Define props (replace 'any' with actual IconProps type if available)
const props = defineProps();
const attrs = useAttrs();
// Inject theme if provided by parent
const defaultTheme = inject('theme', undefined);
console.log(props);
</script>

<template>
  <UI v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }" />
</template>
