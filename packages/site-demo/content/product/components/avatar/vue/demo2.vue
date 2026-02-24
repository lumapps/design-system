<template>
    <Avatar :theme="theme" image="https://i.pravatar.cc/128?img=32" alt="Avatar with actions" size="xl">
        <template #actions>
            <FlexBox orientation="horizontal" vAlign="center" gap="regular">
                <IconButton label="Edit" color="dark" emphasis="low" has-background :icon="mdiPencil" size="s" />
                <IconButton label="See" color="dark" emphasis="low" has-background :icon="mdiEye" size="s" />
                <IconButton label="Delete" color="dark" emphasis="low" has-background :icon="mdiDelete" size="s" />
            </FlexBox>
        </template>
    </Avatar>
</template>

<script setup lang="ts">
import { mdiDelete, mdiEye, mdiPencil } from '@lumx/icons';
import { Avatar, FlexBox, IconButton, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
