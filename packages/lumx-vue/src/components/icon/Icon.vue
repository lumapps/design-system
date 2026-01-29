<template>
    <ui v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { Icon as IconUI, IconProps } from '@lumx/core/js/components/Icon';

import { VueToJSX } from '../../utils/VueToJSX';
import { useTheme } from '../../composables/useTheme';

defineOptions({
    inheritAttrs: false,
});

const ui = VueToJSX(IconUI);
const props = defineProps<IconProps>();
const attrs = useAttrs();
const defaultTheme = useTheme({ defaultTheme: undefined });
</script>
