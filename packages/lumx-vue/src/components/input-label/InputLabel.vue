<template>
    <ui v-bind="{ ...props, ...attrs, theme: props.theme || defaultTheme }">
        <slot />
    </ui>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { InputLabel as InputLabelUI, InputLabelProps } from '@lumx/core/js/components/InputLabel';

import { VueToJSX } from '../../utils/VueToJSX';
import { useTheme } from '../../composables/useTheme';

defineOptions({
    inheritAttrs: false,
});

const ui = VueToJSX(InputLabelUI);
const props = defineProps<InputLabelProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
</script>
