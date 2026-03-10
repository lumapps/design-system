<template>
    <Toolbar>
        <template #before>
            <IconButton label="Previous" emphasis="low" :icon="mdiChevronLeft" />
        </template>
        <template #default>
            <FlexBox orientation="horizontal" horizontal-align="center" gap="regular">
                <Heading typography="title">Folder name</Heading>
                <IconButton label="Previous" emphasis="low" :icon="mdiOpenInNew" />
            </FlexBox>
        </template>
        <template #after>
            <FlexBox orientation="horizontal" horizontal-align="center" gap="regular">
                <TextField :value="value" :icon="mdiMagnify" @change="value = $event" />
                <IconButton label="Grid" emphasis="low" :icon="mdiSort" />
                <Button>New</Button>
            </FlexBox>
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiChevronLeft, mdiMagnify, mdiOpenInNew, mdiSort } from '@lumx/icons';
import { Button, FlexBox, IconButton, TextField, Toolbar, Heading } from '@lumx/vue';

const value = ref('');
</script>
