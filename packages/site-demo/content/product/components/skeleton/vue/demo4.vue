<template>
    <FlexBox orientation="horizontal" gap="big" :style="{ width: '200px' }">
        <SkeletonCircle :theme="theme" size="m" style="flex-shrink: 0" />

        <div :style="{ width: '100%' }">
            <SkeletonTypography :theme="theme" typography="body1" />
            <SkeletonTypography :theme="theme" typography="caption" width="60%" />
        </div>
    </FlexBox>
</template>

<script setup lang="ts">
import { FlexBox, SkeletonCircle, SkeletonTypography, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
