<template>
    <Message v-bind="$attrs" :close-button-label="props['closeButtonProps.label']" @close="handleClose">
        <slot />
    </Message>
</template>

<script setup lang="ts">
import { Message } from '@lumx/vue';

const props = defineProps<{
    onClose?: (event: MouseEvent) => any;
    'closeButtonProps.label': string;
}>();

defineOptions({
    inheritAttrs: false,
});

const handleClose = (event: MouseEvent) => {
    props.onClose?.(event);
};
</script>
