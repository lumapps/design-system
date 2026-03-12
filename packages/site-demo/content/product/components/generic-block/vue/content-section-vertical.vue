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
            <FlexBox orientation="horizontal" gap="regular">
                <Text as="span" typography="body1" color="dark-L2"> <Icon :icon="mdiEarth" /> Open </Text>
                <Text as="span" typography="body1" color="dark-L2">1035 Members</Text>
            </FlexBox>
        </template>
        <template #actions>
            <Placeholder name="3" :width="80" text-align="right" />
        </template>
    </GenericBlock>

    <GenericBlock as="article" orientation="horizontal" :style="{ width: '450px' }">
        <template #figure>
            <Placeholder name="1" />
        </template>
        <template #default>
            <Heading as="h2" typography="subtitle1">Ines Gomez</Heading>
            <FlexBox orientation="horizontal" gap="regular">
                <Text as="span" typography="body1" color="dark-L2">Account Manager</Text>
                <Text as="span" typography="body1" color="dark-L2"> Added in <Link href="#">Sales Team</Link> </Text>
            </FlexBox>
        </template>
        <template #actions>
            <Placeholder name="3" :width="72" text-align="right" />
        </template>
    </GenericBlock>
</template>

<script setup lang="ts">
import { mdiEarth } from '@lumx/icons';
import { FlexBox, GenericBlock, Heading, Icon, Link, Text } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
