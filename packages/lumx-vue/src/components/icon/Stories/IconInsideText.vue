<template>
    <Text as="p"> Lorem ipsum <Icon v-bind="props" /> dolor sit amet. </Text>
</template>

<script setup lang="ts">
import { Icon, IconProps, Text } from '@lumx/vue';

const props = defineProps<IconProps>();
</script>
