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

<script setup lang="ts">
import { computed, useAttrs, defineComponent, h, VNode } from 'vue';
import isEmpty from 'lodash/isEmpty';

import { Button as ButtonUI, ButtonProps } from '@lumx/core/js/components/Button/Button';
import { Theme } from '@lumx/core/js/constants';

import Icon from '../icon/Icon.vue';
import Text from '../text/Text.vue';
import { VueToJSX } from '../../utils/VueToJSX';
import { ResetTheme } from '../../utils/ResetTheme';
import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useSlot } from '../../composables/useSlot';
import { isComponent } from '../../utils/type/isComponent';

/**
 * Button component based on the LumX Core Button.
 * Wraps the React-based core component and provides Vue-specific slot handling.
 */
defineOptions({
    inheritAttrs: false,
});

const ui = VueToJSX(ButtonUI);
const props = defineProps<ButtonProps>();
const attrs = useAttrs();
const defaultSlot = useSlot();

const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
const defaultTheme = useTheme({ defaultTheme: Theme.light });

/**
 * Compute properties to pass to the underlying UI component.
 * Merges attributes, disabled state, and ensures a default theme is set.
 */
const uiProps = computed(() => ({
    ...attrs,
    ...otherProps.value,
    ...disabledStateProps.value,
    theme: props.theme || defaultTheme,
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

            if (children.length === 1 && isComponent(Text)(children[0])) {
                return children[0];
            }
            return h('span', children);
        };
    },
});
</script>
