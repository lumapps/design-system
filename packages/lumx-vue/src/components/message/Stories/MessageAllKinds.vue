<template>
    <StoryMatrix :rows="kinds">
        <template #default="{ row }">
            <Message v-bind="$attrs" :kind="row">
                <slot />
            </Message>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Message, Kind } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

const kinds = withUndefined(Kind);

defineOptions({
    inheritAttrs: false,
});
</script>
