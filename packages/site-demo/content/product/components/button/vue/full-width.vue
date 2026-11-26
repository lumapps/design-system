<template>
    <div :style="{ display: 'flex', width: '100%', flexDirection: 'column', gap: '16px' }">
        <FlexBox fill-space gap="big" orientation="horizontal">
            <Button full-width emphasis="high" :theme="theme">Single full width button</Button>
        </FlexBox>

        <FlexBox fill-space gap="big" orientation="horizontal">
            <Button full-width emphasis="medium" :theme="theme">Two full width buttons</Button>
            <Button full-width emphasis="medium" :theme="theme">Two full width buttons</Button>
        </FlexBox>

        <FlexBox fill-space gap="big" orientation="horizontal">
            <Button full-width emphasis="medium" :theme="theme">Single full width button</Button>
            <Button emphasis="medium" :theme="theme">Button</Button>
        </FlexBox>
    </div>
</template>

<script setup lang="ts">
import { Button, FlexBox, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
