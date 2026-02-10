<template>
    <StoryMatrix
        :rows="vAlignOptions"
        :cell-style="{ border: '1px dashed red' }"
        :first-col-style="{ whiteSpace: 'nowrap', width: '1%' }"
    >
        <template #default="{ row }">
            <FlexBox v-bind="$attrs" :v-align="row">
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
import { HORIZONTAL_ALIGNMENTS } from '@lumx/core/js/components/FlexBox/constants';

defineOptions({
    inheritAttrs: false,
});

const vAlignOptions = withUndefined(HORIZONTAL_ALIGNMENTS);
</script>
