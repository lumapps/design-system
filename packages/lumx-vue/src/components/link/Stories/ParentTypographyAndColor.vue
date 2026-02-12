<template>
    <Text as="p" :color="parentColor" :typography="parentTypography">
        <Link v-bind="attrs" @click="handleClick">
            <template v-if="Array.isArray(label)">
                <template v-for="(item, index) in label" :key="index">
                    <Icon v-if="item.icon" :icon="item.icon" />
                    <template v-else>{{ item }}</template>
                </template>
            </template>
            <template v-else>{{ label }}</template>
        </Link>
    </Text>
</template>

<script setup lang="ts">
import { Link, Text, Icon, Typography, ColorPalette } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

const props = defineProps<{
    label?: string | any[];
    parentTypography?: Typography;
    parentColor?: ColorPalette;
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
