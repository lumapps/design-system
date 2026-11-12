<template>
    <TreeList aria-label="Files" :value="value" @change="value = $event as string">
        <TreeListItem label="Documents">
            <template #before>
                <Icon :icon="mdiFolder" size="xs" />
            </template>
            <TreeListItem label="Report.pdf" value="report" description="Updated yesterday">
                <template #before>
                    <Icon :icon="mdiFileDocument" size="xs" />
                </template>
            </TreeListItem>
            <TreeListItem label="Budget.xlsx" value="budget" description="Updated last week">
                <template #before>
                    <Icon :icon="mdiFileDocument" size="xs" />
                </template>
                <template #after>
                    <Text as="span" typography="caption" color="dark-L2">Draft</Text>
                </template>
            </TreeListItem>
        </TreeListItem>
    </TreeList>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiFolder, mdiFileDocument } from '@lumx/icons';
import { Icon, Text, TreeList, TreeListItem } from '@lumx/vue';

const value = ref('report');
</script>
