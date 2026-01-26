<template>
    <div :style="placeholderStyle">{{ name }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        name: string;
        height?: number | string;
        width?: number | string;
        textAlign?: 'center' | 'right' | 'left';
    }>(),
    {
        height: 36,
        width: 36,
        textAlign: 'center',
    },
);

const placeholderStyle = computed(() => {
    const height = typeof props.height === 'number' ? `${props.height}px` : props.height;
    return {
        height,
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        background: '#FFCFF5',
        color: '#FF00C7',
        textAlign: props.textAlign,
        lineHeight: height,
        borderRadius: '2px',
        fontSize: '12px',
        fontWeight: 500,
        paddingLeft: '14px',
        paddingRight: '14px',
    };
});
</script>
