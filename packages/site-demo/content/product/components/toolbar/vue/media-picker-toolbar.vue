<template>
    <Toolbar>
        <template #default>
            <FlexBox orientation="horizontal" horizontal-align="center" gap="big">
                <Heading typography="title">Toolbar title</Heading>

                <div style="position: relative; display: inline-flex; align-items: center;">
                    <Icon :icon="mdiMagnify" style="position: absolute; left: 8px; pointer-events: none;" />
                    <input
                        v-model="value"
                        type="text"
                        style="padding-left: 32px; padding: 8px 8px 8px 32px; border: 1px solid #ccc; border-radius: 4px;"
                    />
                </div>
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
import { mdiMagnify, mdiViewGrid } from '@lumx/icons';
import { Button, FlexBox, IconButton, Toolbar, Heading, Icon } from '@lumx/vue';

const value = ref('');
</script>
