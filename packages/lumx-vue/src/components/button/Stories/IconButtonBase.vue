<template>
    <IconButton v-bind="attrs" @click="handleClick" />
</template>

<script setup lang="ts">
import { IconButton } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

const props = defineProps<{
    onClick?: (event: MouseEvent) => any;
}>();

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();

const handleClick = (event: MouseEvent) => {
    props.onClick?.(event);
};
</script>
