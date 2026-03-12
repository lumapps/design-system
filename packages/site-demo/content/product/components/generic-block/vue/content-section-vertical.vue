<template>
    <GenericBlock
        as="article"
        orientation="horizontal"
        :style="{ width: '494px' }"
        :actions-props="{ horizontalAlign: 'center' }"
    >
        <template #figure>
            <Placeholder name="1" :height="64" :width="64" />
        </template>
        <template #default>
            <Heading as="h2" typography="subtitle2">Marketing &amp; Comms Workspace</Heading>
            <Text as="p" :truncate="true" typography="body1" color="dark-L2">
                A space to collaborate on events, communication and a workspace.
            </Text>
            <InlineList typography="body1" color="dark-L2">
                <Text as="span"> <Icon :icon="mdiEarth" /> Open </Text>
                <Text as="span">1035 Members</Text>
            </InlineList>
        </template>
        <template #actions>
            <Placeholder name="3" :width="80" text-align="right" />
        </template>
    </GenericBlock>

    <GenericBlock
        as="article"
        orientation="horizontal"
        :style="{ width: '450px' }"
        :actions-props="{ horizontalAlign: 'center' }"
    >
        <template #figure>
            <Placeholder name="1" />
        </template>
        <template #default>
            <Heading as="h2" typography="subtitle1">Ines Gomez</Heading>
            <InlineList typography="body1" color="dark-L2">
                <Text as="span">Account Manager</Text>
                <Text as="span"> Added in <Link href="#">Sales Team</Link> </Text>
            </InlineList>
        </template>
        <template #actions>
            <Placeholder name="3" :width="72" text-align="right" />
        </template>
    </GenericBlock>
</template>

<script setup lang="ts">
import { mdiEarth } from '@lumx/icons';
import { GenericBlock, Heading, Icon, InlineList, Link, Text } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
