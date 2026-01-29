<script setup lang="ts">
import { useAttrs } from 'vue';
import { InputHelper as InputHelperUI, InputHelperProps } from '@lumx/core/js/components/InputHelper';

import { useTheme } from '../../composables/useTheme';
import { VueToJSX } from '../../utils/VueToJSX';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<InputHelperProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
const ui = VueToJSX<InputHelperProps>(InputHelperUI);
</script>

<template>
    <ui v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }">
        <slot />
    </ui>
</template>
