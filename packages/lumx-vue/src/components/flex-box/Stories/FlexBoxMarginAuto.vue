<template>
    <FlexBox v-bind="$attrs">
        <IconButton label="" :icon="mdiAtom" />
    </FlexBox>
</template>

<script setup lang="ts">
import { FlexBox, IconButton } from '@lumx/vue';
import { mdiAtom } from '@lumx/icons';

defineOptions({ inheritAttrs: false });
</script>
