<template>
    <ui v-bind="uiProps" />
</template>

<script lang="ts">
export const emitSchema = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (isChecked: boolean, _value?: string, _name?: string, _event?: Event) => typeof isChecked === 'boolean',
};
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Checkbox as CheckboxUI, BaseCheckboxProps } from '@lumx/core/js/components/Checkbox';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { VueToJSX } from '../../utils/VueToJSX';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<BaseCheckboxProps>();
const attrs = useAttrs();
const { isAnyDisabled, disabledStateProps } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));
const defaultTheme = useTheme();
const emit = defineEmits(emitSchema);
const ui = VueToJSX<BaseCheckboxProps, typeof emitSchema>(CheckboxUI, { emit, events: Object.keys(emitSchema) });

/**
 * Compute properties to pass to the underlying UI component.
 * Merges attributes, disabled state, and ensures a default theme is set.
 */
const uiProps = computed(() => ({
    ...attrs,
    ...props,
    ...disabledStateProps.value,
    theme: props.theme || attrs.theme || defaultTheme,
    'aria-disabled': isAnyDisabled.value,
}));
</script>
