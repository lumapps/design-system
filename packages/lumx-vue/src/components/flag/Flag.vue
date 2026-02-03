<template>
    <ui v-bind="uiProps">
        <slot />
    </ui>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Theme } from '@lumx/core/js/constants';
import { Flag as FlagUI, FlagProps } from '@lumx/core/js/components/Flag';

import { Text } from '../text';

import { VueToJSX } from '../../utils/VueToJSX';
import { useTheme } from '../../composables/useTheme';

defineOptions({
    inheritAttrs: false,
});

const ui = VueToJSX(FlagUI, { nestedComponents: { Text } });
const props = defineProps<FlagProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();

/**
 * Compute properties to pass to the underlying UI component.
 * Merges attributes, disabled state, and ensures a default theme is set.
 */
const uiProps = computed(() => ({
    ...attrs,
    ...props,
    theme: props.theme || attrs.theme || defaultTheme || Theme.light,
}));
</script>
