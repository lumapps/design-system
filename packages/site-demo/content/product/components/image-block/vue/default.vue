<template>
    <ImageBlock
        description="Lorem ipsum dolor sit amet, consectur adipiscing "
        image="https://picsum.photos/id/256/800/546"
        :theme="theme"
        title="Lorem ipsum"
        alt="Lorem ipsum"
        :thumbnail-props="{ aspectRatio: 'horizontal' }"
    >
        <template #actions>
            <FlexBox orientation="horizontal" gap="regular">
                <IconButton label="Edit" color="dark" emphasis="low" :has-background="true" :icon="mdiPencil" />
                <IconButton label="See" color="dark" emphasis="low" :has-background="true" :icon="mdiEye" />
                <IconButton label="Delete" color="dark" emphasis="low" :has-background="true" :icon="mdiDelete" />
            </FlexBox>
        </template>
        <template #tags>
            <ChipGroup>
                <Chip size="s" :theme="theme">Tag 1</Chip>
                <Chip size="s" :theme="theme">Tag 2</Chip>
            </ChipGroup>
        </template>
    </ImageBlock>
</template>

<script setup lang="ts">
import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Chip, ChipGroup, FlexBox, IconButton, ImageBlock, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
