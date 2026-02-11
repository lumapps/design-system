<template>
    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="display1" :width="230" />
        <h1 class="lumx-typography-display1">Display 1</h1>
    </FlexBox>

    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="headline" :width="230" />
        <h2 class="lumx-typography-headline">Headline</h2>
    </FlexBox>

    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="title" :width="230" />
        <h3 class="lumx-typography-title">Title</h3>
    </FlexBox>

    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="subtitle2" :width="230" />
        <h4 class="lumx-typography-subtitle2">Subtitle 2</h4>
    </FlexBox>

    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="subtitle1" :width="230" />
        <h5 class="lumx-typography-subtitle1">Subtitle 1</h5>
    </FlexBox>

    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="body2" :width="230" />
        <p class="lumx-typography-body2">Body 2</p>
    </FlexBox>

    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="body1" :width="230" />
        <p class="lumx-typography-body1">Body 1</p>
    </FlexBox>

    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="caption" :width="230" />
        <p class="lumx-typography-caption">Caption</p>
    </FlexBox>

    <FlexBox orientation="horizontal" gap="huge">
        <SkeletonTypography :theme="theme" typography="overline" :width="230" />
        <p class="lumx-typography-overline">Overline</p>
    </FlexBox>
</template>

<script setup lang="ts">
import { FlexBox, SkeletonTypography, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
