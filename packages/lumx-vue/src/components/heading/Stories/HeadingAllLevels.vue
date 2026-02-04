<template>
    <StoryMatrix :rows="HEADING_ELEMENTS">
        <template #default="{ row }">
            <Heading v-bind="$attrs" :as="row">
                <slot />
            </Heading>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Heading } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { HEADING_ELEMENTS } from '@lumx/core/stories/controls/element';

defineOptions({
    inheritAttrs: false,
});
</script>
