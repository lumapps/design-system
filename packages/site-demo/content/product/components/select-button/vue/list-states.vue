<template>
    <SelectButton
        label="Loading fruits"
        :options="[]"
        :get-option-id="String"
        list-status="loading"
        :translations="LOADING_TRANSLATIONS"
    />
    <SelectButton
        label="Failed fruits"
        :options="[]"
        :get-option-id="String"
        list-status="error"
        :translations="ERROR_TRANSLATIONS"
    />
</template>

<script setup lang="ts">
import { SelectButton } from '@lumx/vue';

const LOADING_TRANSLATIONS = {
    loadingMessage: 'Loading fruits…',
};

const ERROR_TRANSLATIONS = {
    errorMessage: 'Failed to load',
    errorTryReloadMessage: 'Please try again later',
};
</script>
