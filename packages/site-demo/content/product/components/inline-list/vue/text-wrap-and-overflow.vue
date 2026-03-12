<template>
    <InlineList typography="body1" color="dark-L2" :style="{ maxWidth: '275px' }">
        <Text as="span" :no-wrap="true">
            <Icon :icon="mdiEarth" />
            Some text
        </Text>
        <Text as="span" :truncate="true">Very very very very very long text</Text>
    </InlineList>
</template>

<script setup lang="ts">
import { mdiEarth } from '@lumx/icons';
import { Icon, InlineList, Text } from '@lumx/vue';
</script>
