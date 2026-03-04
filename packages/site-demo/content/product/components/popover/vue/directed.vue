<template>
    <FlexBox :style="{ padding: '80px', gap: '128px' }" orientation="vertical">
        <FlexBox :fill-space="true" vertical-align="center" horizontal-align="center">
            <Button ref="leftRef" size="s" emphasis="medium">LEFT</Button>
            <Popover :is-open="true" class="lumx-spacing-padding-huge" :anchor-ref="leftElRef" placement="left">
                Popover
            </Popover>
        </FlexBox>
        <FlexBox :fill-space="true" vertical-align="center" horizontal-align="center">
            <Button ref="topRef" size="s" emphasis="medium">TOP</Button>
            <Popover :is-open="true" class="lumx-spacing-padding-huge" :anchor-ref="topElRef" placement="top">
                Popover
            </Popover>
        </FlexBox>
        <FlexBox :fill-space="true" vertical-align="center" horizontal-align="center">
            <Button ref="bottomRef" size="s" emphasis="medium">BOTTOM</Button>
            <Popover :is-open="true" class="lumx-spacing-padding-huge" :anchor-ref="bottomElRef" placement="bottom">
                Popover
            </Popover>
        </FlexBox>
        <FlexBox :fill-space="true" vertical-align="center" horizontal-align="center">
            <Button ref="rightRef" size="s" emphasis="medium">RIGHT</Button>
            <Popover :is-open="true" class="lumx-spacing-padding-huge" :anchor-ref="rightElRef" placement="right">
                Popover
            </Popover>
        </FlexBox>
    </FlexBox>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { Button, FlexBox, Popover } from '@lumx/vue';

const leftRef = useTemplateRef<InstanceType<typeof Button>>('leftRef');
const leftElRef = computed(() => leftRef.value?.$el as HTMLElement | undefined);

const topRef = useTemplateRef<InstanceType<typeof Button>>('topRef');
const topElRef = computed(() => topRef.value?.$el as HTMLElement | undefined);

const bottomRef = useTemplateRef<InstanceType<typeof Button>>('bottomRef');
const bottomElRef = computed(() => bottomRef.value?.$el as HTMLElement | undefined);

const rightRef = useTemplateRef<InstanceType<typeof Button>>('rightRef');
const rightElRef = computed(() => rightRef.value?.$el as HTMLElement | undefined);
</script>
