<template>
    <RadioButton v-bind="attrs" :is-checked="isChecked" @change="handleChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RadioButton } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

const props = defineProps<{
    isChecked?: boolean;
    onChange?: (value?: string, name?: string, event?: Event) => any;
}>();

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();
const isChecked = ref(props.isChecked || false);

const handleChange = (value?: string, name?: string, event?: Event) => {
    isChecked.value = !isChecked.value;
    props.onChange?.(value, name, event);
};
</script>
