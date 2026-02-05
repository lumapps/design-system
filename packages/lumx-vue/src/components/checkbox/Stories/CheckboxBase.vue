<template>
    <Checkbox v-bind="attrs" @change="handleChange" />
</template>

<script setup lang="ts">
import { Checkbox } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

const props = defineProps<{
    onChange?: (isChecked: boolean, value?: string, name?: string, event?: Event) => any;
}>();

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();

console.log(attrs);

const handleChange = (isChecked: boolean, value?: string, name?: string, event?: Event) => {
    props.onChange?.(isChecked, value, name, event);
};
</script>
