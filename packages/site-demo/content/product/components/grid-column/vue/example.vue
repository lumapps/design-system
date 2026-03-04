<template>
    <GridColumn :item-min-width="64" :max-columns="4" gap="huge">
        <Placeholder name="1" height="auto" width="auto" />
        <Placeholder name="2" height="auto" width="auto" />
        <Placeholder name="3" height="auto" width="auto" />
        <Placeholder name="4" height="auto" width="auto" />
        <Placeholder name="5" height="auto" width="auto" />
        <Placeholder name="6" height="auto" width="auto" />
    </GridColumn>
</template>

<script setup lang="ts">
import { GridColumn } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
