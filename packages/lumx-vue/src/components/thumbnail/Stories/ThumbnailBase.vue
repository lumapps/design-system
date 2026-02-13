<template>
    <Thumbnail v-bind="attrs" @click="handleClick">
        <template v-if="slots.badge" #badge>
            <slot name="badge" />
        </template>
    </Thumbnail>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';
import { Thumbnail } from '@lumx/vue';
import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';

const props = defineProps<{
    onClick?: (event: Event) => any;
}>();

const slots = useSlots();

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrsWithoutHandlers();

const handleClick = (event: Event) => {
    props.onClick?.(event);
};
</script>
