<template>
    <FlexBox orientation="horizontal" gap="big">
        <SkeletonCircle :theme="theme" size="m" />

        <div :style="{ width: '200px' }">
            <SkeletonTypography :theme="theme" typography="body1" />
            <SkeletonTypography :theme="theme" typography="caption" width="60%" />
        </div>
    </FlexBox>
</template>

<script setup lang="ts">
import { FlexBox, SkeletonCircle, SkeletonTypography, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
