<template>
    <FlexBox v-bind="$attrs">
        <p>Some paragraph</p>
    </FlexBox>
</template>

<script setup lang="ts">
import { FlexBox } from '@lumx/vue';

defineOptions({
    inheritAttrs: false,
});
</script>
