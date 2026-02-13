<template>
    <a ref="linkRef" :href="to" data-custom-link v-bind="$attrs">
        <slot />
    </a>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * Example custom link that can be used in linkAs props.
 */
defineProps<{
    to?: string;
}>();

defineOptions({
    inheritAttrs: false,
});

const linkRef = ref<HTMLAnchorElement>();

defineExpose({
    linkRef,
});
</script>
