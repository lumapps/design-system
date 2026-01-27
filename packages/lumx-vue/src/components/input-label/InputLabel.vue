<script setup lang="ts">
import { useAttrs } from 'vue';
import { InputLabel as ui, InputLabelProps } from '@lumx/core/js/components/InputLabel';

import { useTheme } from '../../composables/useTheme';
import { useSlot } from '../../composables/useSlot';

const props = defineProps<InputLabelProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
const defaultSlot = useSlot();
</script>

<template>
    <ui v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme, children: defaultSlot() }" />
</template>
