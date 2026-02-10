<template>
    <Text as="p"> Lorem ipsum <Icon v-bind="attrs" :icon="icon" /> dolor sit amet. </Text>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

import { Icon, Text } from '@lumx/vue';

const attrs = useAttrs();
const icon = attrs.icon as string;
</script>
