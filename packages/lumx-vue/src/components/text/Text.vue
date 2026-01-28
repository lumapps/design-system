<script setup lang="ts">
import { computed, useAttrs, VNodeArrayChildren, useTemplateRef } from 'vue';

import { getTextProps, TextProps } from '@lumx/core/js/components/Text';
import { useOverflowTooltipLabel } from '../../composables/useOverflowTooltipLabel';
import { useSlot } from '../../composables/useSlot';
import { wrapChildrenIconWithSpaces } from '../../utils/wrapChildrenIconWithSpaces';

const props = defineProps<TextProps>();
const attrs = useAttrs();
const defaultSlot = useSlot();
const labelRef = useTemplateRef<HTMLElement>('tooltip-label');
const { tooltipLabel } = useOverflowTooltipLabel(labelRef);

const textProps = computed(() => getTextProps(props));

const RenderSlot = () => {
    const slot = defaultSlot<VNodeArrayChildren>();
    return slot ? wrapChildrenIconWithSpaces(slot) : null;
};

const componentProps = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // remove children from the props sent over to the component.
    const { children, ...rest } = props;
    return { ...attrs, ...rest };
});
</script>

<template>
    <component
        :is="as"
        ref="tooltip-label"
        v-bind="componentProps"
        :class="textProps.className"
        :style="textProps.style"
        :title="tooltipLabel"
    >
        <RenderSlot />
    </component>
</template>
