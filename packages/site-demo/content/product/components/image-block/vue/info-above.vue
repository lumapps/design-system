<template>
    <ImageBlock
        caption-position="over"
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="https://picsum.photos/id/535/640/480"
        :theme="theme"
        title="Lorem ipsum"
        alt="Lorem ipsum"
        :thumbnail-props="{ aspectRatio: 'horizontal' }"
    >
        <template #tags>
            <ChipGroup>
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
