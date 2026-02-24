<template>
    <Tooltip label="Print">
        <Icon :icon="mdiPrinter" :has-shape="true" />
    </Tooltip>
</template>

<script setup lang="ts">
import { mdiPrinter } from '@lumx/icons';
import { Icon, Tooltip } from '@lumx/vue';
</script>
