<template>
    <Thumbnail image="brokenurl.jpg" alt="Fallback to MDI icon" aspect-ratio="square" size="xl" variant="rounded" :theme="theme">
        <template #fallback>
            <Icon :icon="mdiApps" />
        </template>
    </Thumbnail>

    <Thumbnail image="brokenurl.jpg" alt="Fallback react node" aspect-ratio="square" size="xl" variant="rounded" :theme="theme">
        <template #fallback>
            <Badge color="red">
                <Icon :icon="mdiClose" />
            </Badge>
        </template>
    </Thumbnail>
</template>

<script setup lang="ts">
import { mdiApps, mdiClose } from '@lumx/icons';
import { Badge, Icon, Thumbnail, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
