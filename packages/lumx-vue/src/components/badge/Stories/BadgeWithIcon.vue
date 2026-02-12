<template>
    <Badge v-bind="$attrs">
        <Icon :icon="mdiHeart" />
    </Badge>
</template>

<script setup lang="ts">
import { Badge, Icon } from '@lumx/vue';
import { mdiHeart } from '@lumx/icons';
</script>
