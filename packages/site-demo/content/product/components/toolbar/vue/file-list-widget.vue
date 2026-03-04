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
                <div style="position: relative; display: inline-flex; align-items: center;">
                    <Icon :icon="mdiMagnify" style="position: absolute; left: 8px; pointer-events: none;" />
                    <input
                        v-model="value"
                        type="text"
                        style="padding-left: 32px; padding: 8px 8px 8px 32px; border: 1px solid #ccc; border-radius: 4px;"
                    />
                </div>
                <IconButton label="Grid" emphasis="low" :icon="mdiSort" />
                <Button>New</Button>
            </FlexBox>
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiChevronLeft, mdiMagnify, mdiOpenInNew, mdiSort } from '@lumx/icons';
import { Button, FlexBox, IconButton, Toolbar, Heading, Icon } from '@lumx/vue';

const value = ref('');
</script>
