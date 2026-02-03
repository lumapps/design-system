<template>
    <ui v-bind="uiProps">
        <ResetTheme v-if="hasLeftIcon">
            <Icon :icon="props.leftIcon" />
        </ResetTheme>
        <ButtonContent :content="defaultSlot()" />
        <ResetTheme v-if="hasRightIcon">
            <Icon :icon="props.rightIcon" />
        </ResetTheme>
    </ui>
</template>

<script lang="ts">
export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};
</script>

<script setup lang="ts">
import isEmpty from 'lodash/isEmpty';

import { defineComponent, useAttrs, VNode, h, computed } from 'vue';

import { Button as ButtonUI, ButtonProps } from '@lumx/core/js/components/Button/Button';

import { useTheme } from '../../composables/useTheme';
import { useSlot } from '../../composables/useSlot';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { VueToJSX } from '../../utils/VueToJSX';
import { ResetTheme } from '../../utils/ResetTheme';
import Icon from '../icon/Icon.vue';
import Text from '../text/Text.vue';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<ButtonProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
const defaultSlot = useSlot();

const { isAnyDisabled, disabledStateProps } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));
const emit = defineEmits(emitSchema);
const ui = VueToJSX<ButtonProps, typeof emitSchema>(ButtonUI, { emit, events: Object.keys(emitSchema) });

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

const hasLeftIcon = computed(() => !isEmpty(props.leftIcon));
const hasRightIcon = computed(() => !isEmpty(props.rightIcon));

/**
 * Functional component to handle button content.
 * It prevents unnecessary wrapping:
 * - If the child is a single <Text> component, it renders it directly.
 * - Otherwise, it wraps the content in a <span> to ensure correct layout within the button.
 */
const ButtonContent = defineComponent({
    props: ['content'],
    setup(props) {
        return () => {
            const children = props.content as VNode[];
            if (!children || children.length === 0) return null;

            if (children.length === 1 && children[0].type === Text) {
                return children[0];
            }
            return h('span', children);
        };
    },
});
</script>
