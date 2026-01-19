<script setup lang="ts">
import { useAttrs } from 'vue';
import { Icon as ui, IconProps } from '@lumx/core/js/components/Icon';

import { useTheme } from '../../composables/useTheme';

const props = defineProps<IconProps>();
const attrs = useAttrs();
const defaultTheme = useTheme({ defaultTheme: undefined });
</script>

<template>
    <ui v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }" />
</template>
