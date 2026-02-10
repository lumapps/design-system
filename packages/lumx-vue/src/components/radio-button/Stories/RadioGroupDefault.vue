<template>
    <RadioGroup v-bind="attrs">
        <slot />
    </RadioGroup>
</template>

<script setup lang="ts">
import { RadioGroup } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();
</script>
