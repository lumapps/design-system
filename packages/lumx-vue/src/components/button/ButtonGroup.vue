<template>
    <ui v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }">
        <slot />
    </ui>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { ButtonGroup as ButtonGroupUI, ButtonGroupProps } from '@lumx/core/js/components/Button/ButtonGroup';

import { useTheme } from '../../composables/useTheme';
import { VueToJSX } from '../../utils/VueToJSX';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<ButtonGroupProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
const ui = VueToJSX<ButtonGroupProps>(ButtonGroupUI);
</script>
