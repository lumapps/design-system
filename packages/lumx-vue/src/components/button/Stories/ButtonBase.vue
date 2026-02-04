<template>
    <Button v-bind="attrs" @click="handleClick">
        <slot />
    </Button>
</template>

<script setup lang="ts">
import { Button } from '@lumx/vue';
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
