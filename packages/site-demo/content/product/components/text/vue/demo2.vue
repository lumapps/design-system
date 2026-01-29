<template>
    <Text as="h2" typography="title">Title</Text>
    <Text as="p" typography="body1" color="dark-L2">
        Some
        <Text as="span" color="red"> <Icon :icon="mdiHeart" /> colored </Text>
        text
    </Text>
</template>

<script setup lang="ts">
import { mdiHeart } from '@lumx/icons';
import { Icon, Text } from '@lumx/vue';
</script>
