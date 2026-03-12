<template>
    <GenericBlock as="article" orientation="vertical" vertical-align="center">
        <template #figure>
            <Avatar image="https://i.pravatar.cc/128?img=32" alt="Emmitt O Lum. Profile Photo" size="l" />
        </template>
        <template #default>
            <Placeholder name="2" :height="52" :width="104" />
        </template>
        <template #actions>
            <Placeholder name="3" :width="80" />
        </template>
    </GenericBlock>

    <GenericBlock as="article" orientation="vertical" vertical-align="center">
        <template #figure>
            <Thumbnail image="https://picsum.photos/id/24/640/480" alt="Book" variant="rounded" size="xl" />
        </template>
        <template #default>
            <Placeholder name="2" :height="52" :width="104" />
        </template>
        <template #actions>
            <Placeholder name="3" :width="80" />
        </template>
    </GenericBlock>

    <GenericBlock as="article" orientation="vertical" vertical-align="center">
        <template #figure>
            <Icon :icon="mdiPlus" size="l" :has-shape="true" />
        </template>
        <template #default>
            <Placeholder name="2" :height="52" :width="104" />
        </template>
        <template #actions>
            <Placeholder name="3" :width="80" />
        </template>
    </GenericBlock>
</template>

<script setup lang="ts">
import { mdiPlus } from '@lumx/icons';
import { Avatar, GenericBlock, Icon, Thumbnail } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
