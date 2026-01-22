<script setup lang="ts">
import { useAttrs } from 'vue';
import { InputLabel as ui, InputLabelProps } from '@lumx/core/js/components/InputLabel';

import { useTheme } from '../../composables/useTheme';

const props = defineProps<InputLabelProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
</script>

<template>
    <ui v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }">
        <slot />
    </ui>
</template>
