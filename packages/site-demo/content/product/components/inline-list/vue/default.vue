<template>
    <InlineList>
        <Text as="span">Some text</Text>
        <Link href="#">Some link</Link>
        <Icon :icon="mdiEarth" />
    </InlineList>
</template>

<script setup lang="ts">
import { mdiEarth } from '@lumx/icons';
import { Icon, InlineList, Link, Text } from '@lumx/vue';
</script>
