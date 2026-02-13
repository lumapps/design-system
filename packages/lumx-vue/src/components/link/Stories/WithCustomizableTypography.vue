<template>
    <div>
        <component :is="'style'"> :root { --lumx-typography-custom-title1-font-size: 5px; } </component>
        <Link v-bind="attrs" @click="handleClick">{{ label }}</Link>
    </div>
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
