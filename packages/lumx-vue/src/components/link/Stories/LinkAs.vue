<template>
    <Link v-bind="attrs" :link-as="linkAs" @click="handleClick">{{ label }}</Link>
</template>

<script setup lang="ts">
import { Link } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';
import CustomLink from '@lumx/vue/stories/utils/CustomLink.vue';

const props = defineProps<{
    label?: string;
    linkAs?: any;
    onClick?: (event: Event) => any;
}>();

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();

const handleClick = (event: Event) => {
    props.onClick?.(event);
};

// Provide CustomLink as default
defineExpose({
    CustomLink,
});
</script>
