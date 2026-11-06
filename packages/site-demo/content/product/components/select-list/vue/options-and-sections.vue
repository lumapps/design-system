<template>
    <SelectList
        aria-label="Files"
        :options="FILES"
        get-option-id="id"
        get-option-name="name"
        get-option-description="updated"
        get-section-id="type"
        :value="value"
        @change="(newValue) => (value = newValue)"
    >
        <template #sectionTitle="{ sectionId, options }">{{ sectionId }} ({{ options.length }})</template>
        <template #option="{ option }">
            <SelectListOption :value="option.id">
                <template #before>
                    <Icon :icon="option.type === 'Images' ? mdiFileImageOutline : mdiFileDocumentOutline" size="xs" />
                </template>
            </SelectListOption>
        </template>
    </SelectList>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon, SelectList, SelectListOption } from '@lumx/vue';
import { mdiFileDocumentOutline, mdiFileImageOutline } from '@lumx/icons';

const FILES = [
    { id: 'report', name: 'Annual report.pdf', type: 'Documents', updated: 'Updated 2 days ago' },
    { id: 'budget', name: 'Budget 2026.xlsx', type: 'Documents', updated: 'Updated last week' },
    { id: 'logo', name: 'Logo.png', type: 'Images', updated: 'Updated yesterday' },
    { id: 'banner', name: 'Banner.jpg', type: 'Images', updated: 'Updated 3 weeks ago' },
];
type File = (typeof FILES)[number];

const value = ref<File | undefined>();
</script>
