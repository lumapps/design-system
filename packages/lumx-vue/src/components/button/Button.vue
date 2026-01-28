<script setup lang="ts">
import { useAttrs, h, VNode } from 'vue';
import isEmpty from 'lodash/isEmpty';
import { Button as ui, ButtonProps } from '@lumx/core/js/components/Button/Button';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useSlot } from '../../composables/useSlot';
import { Icon } from '../icon';
import { Text } from '../text';

const props = defineProps<ButtonProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
const defaultSlot = useSlot();
const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
const { leftIcon, rightIcon } = attrs;

console.log(props, attrs);

const RenderChildren = () => {
    const slot = defaultSlot<VNode>();
    if (!slot) {
        return null;
    }

    const defSlot = slot[0];

    if (defSlot && defSlot.type === Text) {
        return slot;
    }

    return h('span', slot);
};
</script>

<template>
    <ui
        v-bind="{
            ...attrs,
            ...otherProps,
            ...disabledStateProps,
            'aria-disabled': isAnyDisabled,
            theme: props.theme || defaultTheme,
            children: [
                leftIcon && !isEmpty(leftIcon) ? h(Icon, { icon: leftIcon }) : null,
                RenderChildren(),
                rightIcon && !isEmpty(rightIcon) ? h(Icon, { icon: rightIcon }) : null,
            ],
        }"
    />
</template>
