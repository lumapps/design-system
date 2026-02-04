<template>
    <StoryMatrix :rows="colors" :cols="colorVariants">
        <template #default="{ row, col }">
            <Text v-bind="$attrs" :color="row" :color-variant="col">
                Some text <Icon :icon="mdiHeart" /> with icons <Icon :icon="mdiEarth" />
            </Text>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Text, Icon, ColorPalette, ColorVariant } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mdiEarth, mdiHeart } from '@lumx/icons';

defineOptions({
    inheritAttrs: false,
});

const colorVariants = withUndefined(ColorVariant);
const colors = withUndefined(ColorPalette);
</script>
