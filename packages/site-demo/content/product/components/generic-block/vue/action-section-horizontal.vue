<template>
    <GenericBlock as="article" orientation="vertical" verticalAlign="center">
        <template #figure>
            <Placeholder name="1" />
        </template>
        <template #default>
            <Placeholder name="2" :height="52" :width="104" />
        </template>
        <template #actions>
            <Button emphasis="medium" size="m" :left-icon="mdiStarOutline">Follow</Button>
        </template>
    </GenericBlock>

    <GenericBlock as="article" orientation="vertical" verticalAlign="center">
        <template #figure>
            <Placeholder name="1" :width="64" :height="64" />
        </template>
        <template #default>
            <Placeholder name="2" :height="52" :width="104" />
        </template>
        <template #actions>
            <Button emphasis="medium" size="s">Follow</Button>
        </template>
    </GenericBlock>
</template>

<script setup lang="ts">
import { mdiStarOutline } from '@lumx/icons';
import { Button, GenericBlock } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
