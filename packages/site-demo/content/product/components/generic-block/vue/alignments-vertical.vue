<template>
    <div v-for="(vAlign, idx) in aligns" :key="idx">
        <GenericBlock
            orientation="vertical"
            :style="{ border: '2px solid rgb(255 0 199 / 10%)', borderRadius: '2px' }"
            :vertical-align="vAlign"
        >
            <template #figure>
                <Placeholder name="1" />
            </template>
            <template #default>
                <Placeholder name="2" :height="72" :width="104" />
            </template>
            <template #actions>
                <Placeholder name="3" :width="72" />
            </template>
        </GenericBlock>
        <code>{{ vAlign }}</code>
    </div>
</template>

<script setup lang="ts">
import { GenericBlock } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';

const aligns = ['right', 'center', 'left'] as const;
</script>
