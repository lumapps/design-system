<!-- TabList used as a <nav> with tab links (using URL #hash) -->
<template>
    <TabList :theme="theme" aria-label="Tab list">
        <Tab label="Tab 1">
            <template #action>
                <HashNavLink hash="#" />
            </template>
        </Tab>
        <Tab label="Tab 2">
            <template #action>
                <HashNavLink hash="#tab-2" />
            </template>
        </Tab>
        <Tab label="Tab 3">
            <template #action>
                <HashNavLink hash="#tab-3" />
            </template>
        </Tab>
    </TabList>
</template>

<script setup lang="ts">
import { Tab, TabList, type Theme } from '@lumx/vue';
import HashNavLink from '@lumx/demo/components/content/HashNavLink/index.vue';

defineProps<{ theme?: Theme }>();
</script>
