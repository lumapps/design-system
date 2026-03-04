<template>
    <FlexBox gap="big" orientation="horizontal" :wrap="true">
        <Button size="s" :theme="theme">Default</Button>
        <Button :disabled="true" size="s" :theme="theme">Disabled</Button>
        <Button :left-icon="mdiPencil" size="s" :theme="theme">With Icon</Button>
        <Button :right-icon="mdiMenuDown" size="s" :theme="theme">Dropdown</Button>
        <ButtonGroup>
            <Button size="s" :theme="theme">Split</Button>
            <IconButton label="More" size="s" :icon="mdiMenuDown" :theme="theme" />
        </ButtonGroup>
        <IconButton label="Add" :icon="mdiPlus" size="s" :theme="theme" />
    </FlexBox>

    <FlexBox gap="big" orientation="horizontal" :wrap="true">
        <Button emphasis="medium" size="s" :theme="theme">Default</Button>
        <Button :disabled="true" emphasis="medium" size="s" :theme="theme">Disabled</Button>
        <Button emphasis="medium" :left-icon="mdiPencil" size="s" :theme="theme">With Icon</Button>
        <Button emphasis="medium" :right-icon="mdiMenuDown" size="s" :theme="theme">Dropdown</Button>
        <ButtonGroup>
            <Button emphasis="medium" size="s" :theme="theme">Split</Button>
            <IconButton label="More" emphasis="medium" :icon="mdiMenuDown" size="s" :theme="theme" />
        </ButtonGroup>
        <IconButton label="Add" :icon="mdiPlus" emphasis="medium" size="s" :theme="theme" />
    </FlexBox>

    <FlexBox gap="big" orientation="horizontal" :wrap="true">
        <Button emphasis="low" size="s" :theme="theme">Default</Button>
        <Button :disabled="true" emphasis="low" size="s" :theme="theme">Disabled</Button>
        <Button emphasis="low" :left-icon="mdiPencil" size="s" :theme="theme">With Icon</Button>
        <Button emphasis="low" :right-icon="mdiMenuDown" size="s" :theme="theme">Dropdown</Button>
        <IconButton label="Add" :icon="mdiPlus" emphasis="low" size="s" :theme="theme" />
    </FlexBox>
</template>

<script setup lang="ts">
import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, ButtonGroup, FlexBox, IconButton, type Theme } from '@lumx/vue';
defineProps<{ theme?: Theme }>();
</script>
