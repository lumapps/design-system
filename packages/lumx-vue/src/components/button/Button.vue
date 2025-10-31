<template>
    <lumx-button v-bind="$attrs" :label="label">
        <template v-if="label !== undefined">{{ label }}</template>
        <template v-else><slot /></template>
    </lumx-button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Button } from '@lumx/react';
import r2wc from '@r2wc/react-to-web-component';

const props = defineProps({
    label: String,
});

const WebComponent = r2wc(Button, {
    props: {
        label: 'string',
    }
});

const tagName = 'lumx-button';
if (!customElements.get(tagName)) {
    customElements.define(tagName, WebComponent);
}
</script>

<style lang="scss">
@import "@lumx/core/src/scss/lumx.scss";
@import "@lumx/core/src/scss/components/button/index";
</style>