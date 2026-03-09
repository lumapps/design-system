<template>
    <div :style="{ marginBottom: '80px' }">
        <TextField
            ref="textFieldRef"
            placeholder="Search"
            :value="searchValue"
            :icon="mdiMagnify"
            @change="searchValue = $event"
        />
    </div>
    <Popover
        :is-open="true"
        class="lumx-spacing-padding-huge"
        :anchor-ref="anchorRef"
        placement="bottom-start"
        :fit-to-anchor-width="true"
    >
        Popover's width matching anchor's
    </Popover>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, type ComponentPublicInstance } from 'vue';
import { mdiMagnify } from '@lumx/icons';
import { Popover, TextField } from '@lumx/vue';

const searchValue = ref('');
const textFieldTemplateRef = useTemplateRef<ComponentPublicInstance>('textFieldRef');
const anchorRef = computed<HTMLElement | undefined>(() => textFieldTemplateRef.value?.$el as HTMLElement | undefined);
</script>
