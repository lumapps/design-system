<script setup lang="ts">
import { useAttrs } from 'vue';
import { InputHelper as ui, InputHelperProps } from '@lumx/core/js/components/InputHelper';

import { useTheme } from '../../composables/useTheme';

const props = defineProps<InputHelperProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
</script>

<template>
    <ui v-bind="{ ...attrs, ...props, theme: props.theme || defaultTheme }">
        <slot />
    </ui>
</template>
