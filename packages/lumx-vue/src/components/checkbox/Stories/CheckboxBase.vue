<template>
    <Checkbox v-bind="checkboxProps" @change="handleChange" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Checkbox } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();
const isChecked = ref(false);

const checkboxProps = computed(() => ({
    ...attrs.value,
    isChecked: isChecked.value,
}));

const handleChange = (checked: boolean) => {
    isChecked.value = checked;

    // attrs.onChange(checked);
};
</script>
