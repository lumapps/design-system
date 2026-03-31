<template>
    <div :class="wrapperClass">
        <ImageBlock
            :class="contentClass"
            :caption-style="{ padding: '16px' }"
            description="Lorem ipsum dolor sit amet, consectur adipiscing "
            image="https://picsum.photos/id/24/640/480"
            title="Lorem ipsum"
            alt="Lorem ipsum"
            :thumbnail-props="{ aspectRatio: 'horizontal' }"
        >
            <template #tags>
                <ChipGroup>
                    <Chip size="s">Tag 1</Chip>
                    <Chip size="s">Tag 2</Chip>
                </ChipGroup>
            </template>
        </ImageBlock>
    </div>
</template>

<script setup lang="ts">
import { classNames } from '@lumx/core/js/utils';
import { Chip, ChipGroup, ImageBlock } from '@lumx/vue';

const wrapperClass = classNames.join(classNames.background('dark-L5'), classNames.padding('huge'));
const contentClass = classNames.background('light');
</script>
