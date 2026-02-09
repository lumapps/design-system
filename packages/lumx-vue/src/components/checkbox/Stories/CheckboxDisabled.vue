<template>
    <StoryMatrix :rows="disabledStates">
        <template #default="{ row, index }">
            <Checkbox
                v-bind="{ ...$attrs, ...row }"
                :is-checked="checkedStates[index]"
                @change="(checked) => handleChange(index, checked)"
            />
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';

const props = defineProps<{
    isChecked?: boolean | 'intermediate';
    onChange?: (isChecked: boolean, value?: string, name?: string, event?: Event) => any;
}>();

defineOptions({
    inheritAttrs: false,
});

const disabledStates = [{ isDisabled: true }, { 'aria-disabled': true }];
const checkedStates = ref(disabledStates.map(() => props.isChecked || false));

const handleChange = (index: number, newChecked: boolean, value?: string, name?: string, event?: Event) => {
    checkedStates.value[index] = newChecked;
    props.onChange?.(newChecked, value, name, event);
};
</script>
