<template>
    <Button :style="{ marginBottom: '80px' }" ref="anchorRef" size="s" emphasis="medium">Anchor</Button>

    <Popover :is-open="true" class="lumx-spacing-padding-huge" :anchor-ref="anchorElRef" placement="bottom">
        Popover
    </Popover>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { Button, Popover } from '@lumx/vue';

const anchorRef = useTemplateRef<InstanceType<typeof Button>>('anchorRef');
const anchorElRef = computed(() => anchorRef.value?.$el as HTMLElement | undefined);
</script>
