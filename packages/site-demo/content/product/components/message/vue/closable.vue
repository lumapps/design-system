<template>
    <Message
        v-if="isMessageDisplayed"
        kind="info"
        :has-background="true"
        close-button-label="Close"
        @close="isMessageDisplayed = false"
    >
        <p>
            Message text quisque tincidunt lobortis dui non auctor. Donec porta, ligula volutpat vehicula aliquet, dui
            sapien tempus felis, sed cursus diam ante.
        </p>
    </Message>
    <Button v-else @click="isMessageDisplayed = true">Reset message display</Button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button, Message } from '@lumx/vue';
const isMessageDisplayed = ref(true);
</script>
