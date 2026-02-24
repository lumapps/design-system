<template>
    <FlexBox :style="{ marginTop: '80px', gap: '128px' }" orientation="vertical">
        <Button ref="topStartAnchorRef" size="s" emphasis="medium" :style="{ placeSelf: 'flex-start' }"> TOP_START </Button>
        <Popover
            :is-open="true"
            class="lumx-spacing-padding-huge"
            :anchor-ref="topStartAnchorElRef"
            placement="top-start"
        >
            Popover aligned on start of the top side
        </Popover>
        <Button ref="topEndAnchorRef" size="s" emphasis="medium" :style="{ placeSelf: 'flex-end' }"> TOP_END </Button>
    </FlexBox>
    <Popover :is-open="true" class="lumx-spacing-padding-huge" :anchor-ref="topEndAnchorElRef" placement="top-end">
        Popover aligned on start of the top side
    </Popover>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { Button, FlexBox, Popover } from '@lumx/vue';

const topStartAnchorRef = useTemplateRef<InstanceType<typeof Button>>('topStartAnchorRef');
const topStartAnchorElRef = computed(() => topStartAnchorRef.value?.$el as HTMLElement | undefined);

const topEndAnchorRef = useTemplateRef<InstanceType<typeof Button>>('topEndAnchorRef');
const topEndAnchorElRef = computed(() => topEndAnchorRef.value?.$el as HTMLElement | undefined);
</script>
