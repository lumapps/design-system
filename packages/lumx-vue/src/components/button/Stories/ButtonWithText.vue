<template>
    <Button v-bind="attrs" @click="handleClick">
        <Text as="span" truncate>Button with Text component</Text>
    </Button>
</template>

<script setup lang="ts">
import { Button, Text } from '@lumx/vue';
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
