<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { Icon as UI, IconProps } from '@lumx/core/js/components/Icon';
import { Theme } from '@lumx/core/js/constants';

const props = defineProps<IconProps>();
const attrs = useAttrs();

const defaultTheme = inject('theme', undefined) || Theme.light;
</script>

<template>
  <UI v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }" />
</template>
