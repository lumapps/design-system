<template>
    <Chip :theme="theme">Default</Chip>

    <Chip :theme="theme">
        <template #before>
            <Icon :icon="mdiEmail" size="xs" />
        </template>
        Default rich
    </Chip>
</template>

<script setup lang="ts">
import { mdiEmail } from '@lumx/icons';
import { Chip, Icon, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
