<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { Icon as UI, IconProps } from '@lumx/core/js/components/Icon';

const props = defineProps<IconProps>();
const attrs = useAttrs();

const defaultTheme = inject('theme', undefined);
</script>

<template>
  <UI v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }" />
</template>
