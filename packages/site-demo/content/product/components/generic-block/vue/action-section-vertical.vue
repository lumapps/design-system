<template>
    <GenericBlock
        as="article"
        orientation="horizontal"
        :style="{ maxWidth: '517px' }"
        gap="medium"
        :actions-props="{ gap: 'tiny', horizontalAlign: 'center' }"
    >
        <template #figure>
            <Placeholder name="1" />
        </template>
        <template #default>
            <Placeholder name="2" text-align="left" :width="244" />
        </template>
        <template #actions>
            <Button emphasis="medium" size="m" :right-icon="mdiMenuDown">Role</Button>
            <Button emphasis="medium" size="m" :left-icon="mdiClose">Medium</Button>
        </template>
    </GenericBlock>

    <GenericBlock
        as="article"
        orientation="horizontal"
        :style="{ maxWidth: '424px', width: '100%' }"
        gap="medium"
        :actions-props="{ horizontalAlign: 'center' }"
    >
        <template #figure>
            <Placeholder name="1" :height="64" :width="64" />
        </template>
        <template #default>
            <Placeholder name="2" text-align="left" :height="64" width="100%" />
        </template>
        <template #actions>
            <Checkbox :is-disabled="true" :input-props="{ 'aria-label': 'Select row' }" />
        </template>
    </GenericBlock>
</template>

<script setup lang="ts">
import { mdiClose, mdiMenuDown } from '@lumx/icons';
import { Button, Checkbox, GenericBlock } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
