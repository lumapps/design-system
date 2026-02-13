<template>
    <Link v-bind="attrs" @click="handleClick">{{ label }}</Link>
</template>

<script setup lang="ts">
import { Link } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

const props = defineProps<{
    label?: string;
    onClick?: (event: Event) => any;
}>();

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();

const handleClick = (event: Event) => {
    props.onClick?.(event);
};
</script>
