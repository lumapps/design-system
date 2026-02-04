<template>
    <Checkbox v-bind="filteredAttrs" @change="handleChange" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Checkbox } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

const props = defineProps<{
    onChange?: (isChecked: boolean, value?: string, name?: string, event?: Event) => any;
}>();

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();

// Filter out onChange to prevent it from being passed as a prop to Checkbox
// This prevents double execution (once from the prop, once from the @change event)
const filteredAttrs = computed(() => {
    const { onChange, ...rest } = attrs.value;
    return rest;
});

const handleChange = (isChecked: boolean, value?: string, name?: string, event?: Event) => {
    props.onChange?.(isChecked, value, name, event);
};
</script>
