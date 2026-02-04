<template>
    <StoryMatrix :rows="kinds">
        <template #default="{ row }">
            <InputHelper v-bind="$attrs" :kind="row">
                <slot />
            </InputHelper>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { InputHelper, Kind } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

defineOptions({
    inheritAttrs: false,
});

const kinds = withUndefined(Kind);
</script>
