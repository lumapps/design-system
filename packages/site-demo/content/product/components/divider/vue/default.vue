<template>
    <Divider :theme="theme" :class="classNames.margin('vertical', 'big')" />
</template>

<script setup lang="ts">
import { classNames } from '@lumx/core/js/utils';
import { Divider, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
