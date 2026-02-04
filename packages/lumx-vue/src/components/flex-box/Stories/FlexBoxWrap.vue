<template>
    <StoryMatrix :rows="[{ wrap: false }, { wrap: true }]" :cols="orientations">
        <template #default="{ row, col }">
            <div :style="{ border: '1px dashed red', width: '100px', height: '100px', margin: '20px auto' }">
                <FlexBox v-bind="$attrs" :wrap="row.wrap" :orientation="col">
                    <Button>Button 1</Button>
                    <Text as="p"> Some paragraph </Text>
                    <Button>Button 3</Button>
                </FlexBox>
            </div>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { FlexBox, Button, Text, Orientation } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';

defineOptions({
    inheritAttrs: false,
});

const orientations = Object.values(Orientation);
</script>
