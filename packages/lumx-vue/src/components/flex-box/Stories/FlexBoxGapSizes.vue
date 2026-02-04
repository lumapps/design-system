<template>
    <StoryMatrix :rows="gapOptions">
        <template #default="{ row }">
            <FlexBox v-bind="$attrs" :gap="row">
                <Button>Button 1</Button>
                <Text as="p"> Some paragraph </Text>
                <Button>Button 3</Button>
            </FlexBox>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { FlexBox, Button, Text } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { GAP_SIZES } from '@lumx/core/js/components/FlexBox/constants';

defineOptions({
    inheritAttrs: false,
});

const gapOptions = withUndefined(GAP_SIZES);
</script>
