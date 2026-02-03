<template>
    <Text v-bind="uiProps">
        <slot />
    </Text>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import { HeadingProps, getHeadingProps } from '@lumx/core/js/components/Heading';

import { Text } from '../text';
import { useTheme } from '../../composables/useTheme';
import { useHeadingLevel } from './useHeadingLevel';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<HeadingProps>();
const attrs = useAttrs();
const defaultTheme = useTheme();
const context = useHeadingLevel();

const uiProps = computed(() => {
    const { className, ...headingProps } = getHeadingProps(
        {
            ...attrs,
            ...props,
            className: attrs.class as string,
        },
        context.headingElement,
    );

    return {
        ...headingProps,
        class: className,
        theme: props.theme || attrs.theme || defaultTheme,
    };
});
</script>
