<template>
    <GenericBlock orientation="vertical" vertical-align="center">
        <template #figure>
            <Placeholder name="1" :height="64" :width="64" />
        </template>
        <template #default>
            <Placeholder name="2" :height="52" :width="104" />
        </template>
        <template #actions>
            <Placeholder name="3" :width="80" />
        </template>
    </GenericBlock>

    <GenericBlock orientation="horizontal">
        <template #figure>
            <Placeholder name="1" />
        </template>
        <template #default>
            <Placeholder name="2" :width="122" />
        </template>
        <template #actions>
            <Placeholder name="3" :width="80" text-align="right" />
        </template>
    </GenericBlock>
</template>

<script setup lang="ts">
import { GenericBlock } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
