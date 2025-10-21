<template>
    <lumx-button v-bind="$attrs">
        <slot />
    </lumx-button>
</template>

<script setup lang="ts">
import { Button } from '@lumx/react';
import r2wc from '@r2wc/react-to-web-component';

const WebComponent = r2wc(Button, {
    shadow: 'open',
});

const tagName = 'lumx-button';

if (!customElements.get(tagName)) {
    customElements.define(tagName, WebComponent);
}
</script>
