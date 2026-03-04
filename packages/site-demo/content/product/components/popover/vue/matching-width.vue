<template>
    <div :style="{ marginBottom: '80px' }">
        <input
            ref="anchorRef"
            type="text"
            placeholder="Search"
            :value="searchValue"
            @input="searchValue = ($event.target as HTMLInputElement).value"
            class="lumx-text-field"
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
import { computed, ref, useTemplateRef } from 'vue';
import { Popover } from '@lumx/vue';

const searchValue = ref('');
const templateRef = useTemplateRef<HTMLInputElement>('anchorRef');
const anchorRef = computed(() => templateRef.value ?? undefined);
</script>
