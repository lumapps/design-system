<template>
    <ImageBlock
        align="center"
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="https://picsum.photos/id/653/275/500"
        :theme="theme"
        title="Lorem ipsum"
        alt="Lorem ipsum"
        :thumbnail-props="{ aspectRatio: 'original' }"
    >
        <template #tags>
            <ChipGroup align="center">
                <Chip size="s" :theme="theme">Tag 1</Chip>
                <Chip size="s" :theme="theme">Tag 2</Chip>
            </ChipGroup>
        </template>
    </ImageBlock>
</template>

<script setup lang="ts">
import { Chip, ChipGroup, ImageBlock, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
