<template>
    <Thumbnail
        image="brokenurl.jpg"
        alt="Fallback to MDI icon"
        variant="rounded"
        aspect-ratio="square"
        size="xl"
        :theme="theme"
    >
        <template #fallback>
            <div
                :class="classNames.background('dark-L6')"
                style="height: 128px; display: flex; align-items: center; justify-content: center"
            >
                <Icon :icon="mdiApps" size="xxs" color="dark-L1" />
            </div>
        </template>
    </Thumbnail>

    <Thumbnail
        image="brokenurl.jpg"
        alt="Fallback custom content"
        aspect-ratio="square"
        size="xl"
        variant="rounded"
        :theme="theme"
    >
        <template #fallback>
            <Badge color="red">
                <Icon :icon="mdiClose" />
            </Badge>
        </template>
    </Thumbnail>
</template>

<script setup lang="ts">
import { mdiApps, mdiClose } from '@lumx/icons';
import { classNames } from '@lumx/core/js/utils';
import { Badge, Icon, Thumbnail, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
