<template>
    <GenericBlock
        as="article"
        orientation="vertical"
        vertical-align="center"
        gap="big"
        :style="{ maxWidth: '216px' }"
        :content-props="{ verticalAlign: 'left', gap: 'tiny' }"
    >
        <template #figure>
            <Placeholder name="2" :height="154" :width="216" />
        </template>
        <template #default>
            <Avatar image="https://i.pravatar.cc/128?img=32" alt="Emmitt O. Lum" size="s" />
            <Heading as="h2" typography="subtitle2">Fiscal Year Results and Conference</Heading>
            <Text as="p" typography="body1" color="dark-L2">
                Our company will release its Fiscal Year Results next…
            </Text>
        </template>
    </GenericBlock>

    <GenericBlock as="article" orientation="vertical" vertical-align="center" :style="{ maxWidth: '184px' }">
        <template #figure>
            <Placeholder name="1" :height="64" :width="64" />
        </template>
        <template #default>
            <Heading as="h2" typography="subtitle2">Slack</Heading>
            <Text as="p" typography="body1" color="dark-L2">A communication platform including chat rooms…</Text>
        </template>
        <template #actions>
            <Placeholder name="3" :width="80" />
        </template>
    </GenericBlock>
</template>

<script setup lang="ts">
import { Avatar, GenericBlock, Heading, Text } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
