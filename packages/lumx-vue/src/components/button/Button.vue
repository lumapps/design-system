<script setup lang="ts">
import { useAttrs, h, VNodeArrayChildren, VNode, computed, defineComponent, provide } from 'vue';
import isEmpty from 'lodash/isEmpty';
import { Button as ui, ButtonProps } from '@lumx/core/js/components/Button/Button';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useSlot } from '../../composables/useSlot';
import { Icon } from '../icon';
import { Text } from '../text';
import { JSXElement } from '@lumx/react';

const props = defineProps<Omit<ButtonProps, 'onClick'>>();
const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>();
const attrs = useAttrs();
const defaultTheme = useTheme();
const defaultSlot = useSlot();

defineOptions({
  inheritAttrs: false
});

const onClick = (event: MouseEvent) => {
    console.log('emit');
    emit('click', event);
};

const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps({
    ...props,
    onClick,
});

const ThemeProvider = defineComponent({
    props: ['theme'],
    setup(p, { slots }) {
        provide('theme', p.theme);
        return () => slots.default?.();
    },
});

const RenderChildren = () => {
    const slot = defaultSlot<VNodeArrayChildren>();
    if (!slot) {
        return null;
    }

    const defSlot = slot[0] as VNode;

    if (defSlot && defSlot.type === Text) {
        return slot;
    }

    return h('span', slot);
};

const buttonProps = computed(() => ({
    ...attrs,
    ...otherProps.value,
    ...disabledStateProps.value,
    'aria-disabled': isAnyDisabled.value,
    theme: defaultTheme,
    children: [
        props.leftIcon && !isEmpty(props.leftIcon)
            ? h(ThemeProvider, { theme: undefined }, { default: () => h(Icon, { icon: props.leftIcon }) })
            : null,
        RenderChildren(),
        props.rightIcon && !isEmpty(props.rightIcon)
            ? h(ThemeProvider, { theme: undefined }, { default: () => h(Icon, { icon: props.rightIcon }) })
            : null,
    ] as JSXElement,
}));
</script>

<template>
    <ui v-bind="buttonProps" />
</template>
