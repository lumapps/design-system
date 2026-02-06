<template>
    <Text as="p" v-bind="$attrs">Some text <Icon :icon="mdiHeart" /> with icons <Icon :icon="mdiEarth" /> </Text>
</template>

<script setup lang="ts">
import { Text, Icon } from '@lumx/vue';
import { mdiEarth, mdiHeart } from '@lumx/icons';
</script>
