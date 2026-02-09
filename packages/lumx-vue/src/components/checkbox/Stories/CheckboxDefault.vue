<template>
    <Checkbox v-bind="attrs" :is-checked="isChecked" @change="handleChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

const props = defineProps<{
    isChecked?: boolean | 'intermediate';
    onChange?: (isChecked: boolean, value?: string, name?: string, event?: Event) => any;
}>();

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();
const isChecked = ref(props.isChecked || false);

const handleChange = (newChecked: boolean, value?: string, name?: string, event?: Event) => {
    isChecked.value = newChecked;
    props.onChange?.(newChecked, value, name, event);
};
</script>
