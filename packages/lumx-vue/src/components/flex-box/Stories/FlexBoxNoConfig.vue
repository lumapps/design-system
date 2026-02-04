<template>
    <FlexBox v-bind="$attrs">
        <Button>Button 1</Button>
        <Text as="p"> Some paragraph </Text>
        <Button>Button 3</Button>
    </FlexBox>
</template>

<script setup lang="ts">
import { FlexBox, Button, Text } from '@lumx/vue';

defineOptions({
    inheritAttrs: false,
});
</script>
