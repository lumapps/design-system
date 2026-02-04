<template>
    <component :is="props.as || 'div'" v-bind="componentProps" :class="componentProps.className">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { getFlexBoxProps } from '@lumx/core/js/components/FlexBox';
import type { FlexBoxProps } from './types';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<FlexBoxProps>();
const attrs = useAttrs();

const componentProps = computed(() => ({
    ...attrs,
    ...getFlexBoxProps({ ...props, className: attrs.class as string }),
}));
</script>
