<template>
    <Avatar :theme="theme" image="https://i.pravatar.cc/128?img=32" alt="XS" size="xs" />
    <Avatar :theme="theme" image="https://i.pravatar.cc/128?img=32" alt="S" size="s" />
    <Avatar :theme="theme" image="https://i.pravatar.cc/128?img=32" alt="M" size="m" />
    <Avatar :theme="theme" image="https://i.pravatar.cc/128?img=32" alt="L" size="l" />
    <Avatar :theme="theme" image="https://i.pravatar.cc/128?img=32" alt="XL" size="xl" />
</template>

<script setup lang="ts">
import { Avatar, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
