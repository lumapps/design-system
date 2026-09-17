<template>
    <FlexBox as="form" orientation="vertical" gap="regular">
        <InputRequiredLegend label="Indicates a required field" :theme="theme" />
        <TextField
            label="First name"
            :value="firstName"
            :is-required="true"
            :theme="theme"
            @change="firstName = $event"
        />
        <TextField label="Nickname" :value="nickname" :theme="theme" @change="nickname = $event" />
    </FlexBox>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FlexBox, InputRequiredLegend, TextField, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const firstName = ref('');
const nickname = ref('');
</script>
