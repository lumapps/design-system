<template>
    <StoryMatrix :rows="ALL_TYPOGRAPHY">
        <template #default="{ row }">
            <Heading v-bind="$attrs" :typography="row">
                <slot />
            </Heading>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Heading } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';

defineOptions({
    inheritAttrs: false,
});
</script>
