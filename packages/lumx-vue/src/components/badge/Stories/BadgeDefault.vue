<template>
    <Badge v-bind="$attrs">
        <slot />
    </Badge>
</template>

<script setup lang="ts">
import { Badge } from '@lumx/vue';
</script>
