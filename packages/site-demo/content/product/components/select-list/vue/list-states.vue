<template>
    <SelectList
        aria-label="Loading fruits"
        min-width="xxl"
        :options="[]"
        :get-option-id="String"
        list-status="loading"
        :translations="LOADING_TRANSLATIONS"
    />
    <SelectList
        aria-label="Failed fruits"
        :options="[]"
        :get-option-id="String"
        list-status="error"
        :translations="ERROR_TRANSLATIONS"
    />
</template>

<script setup lang="ts">
import { SelectList } from '@lumx/vue';

const LOADING_TRANSLATIONS = {
    loadingMessage: 'Loading fruits…',
};

const ERROR_TRANSLATIONS = {
    errorMessage: 'Failed to load',
    errorTryReloadMessage: 'Please try again later',
};
</script>
