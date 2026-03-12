<template>
    <InlineList typography="body1" color="dark-L2" :wrap="true" :style="{ maxWidth: '275px' }">
        <Text as="span">
            <Icon :icon="mdiEarth" />
            Some text
        </Text>
        <Text as="span">Very very very very very long text</Text>
    </InlineList>
</template>

<script setup lang="ts">
import { mdiEarth } from '@lumx/icons';
import { Icon, InlineList, Text } from '@lumx/vue';
</script>
