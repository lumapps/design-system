<template>
    <div style="min-width: 260px">
        <TabProvider :active-tab-index="activeTab" @change="activeTab = $event">
            <TabList :theme="theme" :layout="TabListLayout.clustered" aria-label="Tab list">
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
            </TabList>

            <TabPanel class="lumx-spacing-padding-vertical-huge">Tab 1 content</TabPanel>
            <TabPanel class="lumx-spacing-padding-vertical-huge">Tab 2 content</TabPanel>
            <TabPanel class="lumx-spacing-padding-vertical-huge">Tab 3 content</TabPanel>
        </TabProvider>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Tab, TabList, TabListLayout, TabPanel, TabProvider, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const activeTab = ref(0);
</script>
