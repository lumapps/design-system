<!-- Demo "hash" nav link displaying a <a> with aria-current -->
<template>
    <a v-bind="attrs" :href="hash" :aria-current="isActive ? 'page' : undefined">
        <slot />
    </a>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });
const { hash } = defineProps<{ hash: string }>();
const attrs = useAttrs();

const matchesHash = () => (window.location.hash || '#') === hash;
const isActive = ref(matchesHash());
const onHashChange = () => isActive.value = matchesHash();

onMounted(() => window.addEventListener('hashchange', onHashChange));
onUnmounted(() => window.removeEventListener('hashchange', onHashChange));
</script>
