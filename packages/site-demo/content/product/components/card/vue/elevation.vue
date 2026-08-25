<template>
    <FlexBox orientation="horizontal" gap="big" :wrap="true">
        <Card v-for="elevation in ELEVATIONS" :key="elevation" :elevation="elevation">
            <Text as="span">Elevation {{ elevation }}</Text>
        </Card>
    </FlexBox>
</template>

<script setup lang="ts">
import { Card, FlexBox, Text } from '@lumx/vue';

const ELEVATIONS = [1, 2, 3, 4, 5] as const;
</script>
