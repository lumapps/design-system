<template>
    <ui v-bind="uiProps" />
</template>

<script lang="ts">
export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { IconButton as IconButtonUI, IconButtonProps } from '@lumx/core/js/components/Button/IconButton';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { VueToJSX } from '../../utils/VueToJSX';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<IconButtonProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
const emit = defineEmits(emitSchema);
const ui = VueToJSX<IconButtonProps, typeof emitSchema>(IconButtonUI, { emit, events: Object.keys(emitSchema) });

const { isAnyDisabled, disabledStateProps } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));

/**
 * Compute properties to pass to the underlying UI component.
 * Merges attributes, disabled state, and ensures a default theme is set.
 */
const uiProps = computed(() => ({
    ...attrs,
    ...props,
    ...disabledStateProps.value,
    title: props.label,
    theme: props.theme || attrs.theme || defaultTheme,
    'aria-disabled': isAnyDisabled.value,
}));
</script>
