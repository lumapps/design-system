<template>
    <Chip :theme="theme" @click="onClick">
        <template #after>
            <Icon :icon="mdiClose" size="xs" />
        </template>
        Dismissible
    </Chip>

    <Chip :theme="theme" @click="onClick">
        <template #before>
            <Icon :icon="mdiEmail" size="xs" />
        </template>
        <template #after>
            <Icon :icon="mdiClose" size="xs" />
        </template>
        Dismissible rich
    </Chip>
</template>

<script setup lang="ts">
import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const onClick = () => console.log('clicked chip');
</script>
