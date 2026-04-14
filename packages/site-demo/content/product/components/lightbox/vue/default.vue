<template>
    <Button ref="triggerRef" @click="isOpen = true">Open LightBox</Button>
    <Lightbox
        :is-open="isOpen"
        :parent-element="(triggerRef as any)?.$el"
        :close-button-props="{ label: 'Close' }"
        @close="isOpen = false"
    >
        <FlexBox vertical-align="center" horizontal-align="center" style="height: 100%">
            <Thumbnail alt="Portrait image" image="https://picsum.photos/id/653/275/500" />
        </FlexBox>
    </Lightbox>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button, FlexBox, Lightbox, Thumbnail } from '@lumx/vue';

const isOpen = ref(false);
const triggerRef = ref<any>(null);
</script>
