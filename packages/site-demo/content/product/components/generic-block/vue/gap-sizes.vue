<template>
    <div v-for="gap in Object.values(GenericBlockGapSize)" :key="gap">
        <GenericBlock
            orientation="vertical"
            horizontal-align="center"
            vertical-align="center"
            :style="{ border: '2px solid rgb(255 0 199 / 10%)', borderRadius: '2px' }"
            :gap="gap"
        >
            <template #figure>
                <Placeholder name="1" />
            </template>
            <template #default>
                <Placeholder name="2" :height="52" :width="104" />
            </template>
            <template #actions>
                <Placeholder name="3" :width="72" />
            </template>
        </GenericBlock>
        <code>{{ gap }}</code>
    </div>
</template>

<script setup lang="ts">
import { GenericBlock, GenericBlockGapSize } from '@lumx/vue';
import Placeholder from '@lumx/demo/components/content/Placeholder/index.vue';
</script>
