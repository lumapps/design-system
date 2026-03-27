<template>
    <div style="min-width: 340px">
        <TabProvider :active-tab-index="activeTab" @change="activeTab = $event">
            <TabList :theme="theme" aria-label="Tab list">
                <Tab label="Tab 1" :icon="mdiBowl" />
                <Tab label="Tab 2" :icon="mdiBreadSliceOutline" :icon-props="{ color: 'red-L1', hasShape: false }" />
                <Tab label="Tab 3" :icon="mdiSilverwareForkKnife" />
            </TabList>

            <TabPanel class="lumx-spacing-padding-vertical-huge">Tab 1 content</TabPanel>
            <TabPanel class="lumx-spacing-padding-vertical-huge">Tab 2 content</TabPanel>
            <TabPanel class="lumx-spacing-padding-vertical-huge">Tab 3 content</TabPanel>
        </TabProvider>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiBowl, mdiBreadSliceOutline, mdiSilverwareForkKnife } from '@lumx/icons';
import { Tab, TabList, TabPanel, TabProvider, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const activeTab = ref(0);
</script>
