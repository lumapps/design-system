<template>
    <Toolbar>
        <template #before>
            <IconButton label="Previous" emphasis="low" :icon="mdiChevronLeft" />
        </template>
        <template #default>
            <FlexBox orientation="horizontal" horizontal-align="center" gap="big">
                <Heading typography="title">Toolbar title</Heading>

                <TextField :value="value" :icon="mdiMagnify" @change="value = $event" />
            </FlexBox>
        </template>
        <template #after>
            <FlexBox orientation="horizontal" horizontal-align="center" gap="regular">
                <IconButton label="Grid" emphasis="low" :icon="mdiViewGrid" />
                <Button>Action</Button>
            </FlexBox>
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiChevronLeft, mdiMagnify, mdiViewGrid } from '@lumx/icons';
import { Button, FlexBox, IconButton, TextField, Toolbar, Heading } from '@lumx/vue';

const value = ref('');
</script>
