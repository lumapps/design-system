<template>
    <div v-for="(hAlign, idx) in aligns" :key="idx">
        <GenericBlock
            orientation="horizontal"
            :style="{ border: '2px solid rgb(255 0 199 / 10%)', borderRadius: '2px' }"
            :horizontal-align="hAlign"
        >
            <template #figure>
                <Placeholder name="1" />
            </template>
            <template #default>
                <Placeholder name="2" text-align="left" :height="72" :width="104" />
            </template>
            <template #actions>
                <Placeholder name="3" text-align="right" :width="72" />
            </template>
        </GenericBlock>
        <code>{{ hAlign }}</code>
    </div>
</template>

<script setup lang="ts">
import { GenericBlock } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';

const aligns = ['top', 'center', 'bottom'] as const;
</script>
