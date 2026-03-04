<template>
    <Chip :theme="theme" size="s">Small</Chip>

    <Chip :theme="theme" size="s">
        <template #before>
            <Icon :icon="mdiEmail" size="xxs" />
        </template>
        Small rich
    </Chip>

    <Chip :theme="theme" size="s" @click="onClick">
        <template #after>
            <Icon :icon="mdiClose" size="xxs" />
        </template>
        Small dismissible
    </Chip>
</template>

<script setup lang="ts">
import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const onClick = () => console.log('clicked chip');
</script>
