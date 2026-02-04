<template>
    <StoryMatrix :rows="typos">
        <template #default="{ row }">
            <Text v-bind="$attrs" :typography="row">
                Some text <Icon :icon="mdiHeart" /> with icons <Icon :icon="mdiEarth" />
            </Text>
        </template>
    </StoryMatrix>
</template>

<script setup lang="ts">
import { Text, Icon } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mdiEarth, mdiHeart } from '@lumx/icons';

defineOptions({
    inheritAttrs: false,
});

const typos = withUndefined(ALL_TYPOGRAPHY);
</script>
