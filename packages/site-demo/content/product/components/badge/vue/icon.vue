<template>
    <Badge color="green">
        <Icon :icon="mdiCheck" />
    </Badge>

    <Badge color="red">
        <Icon :icon="mdiClose" />
    </Badge>

    <Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar with icon" size="m">
        <template #badge>
            <Badge color="yellow">
                <Icon :icon="mdiStar" />
            </Badge>
        </template>
    </Avatar>

    <Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar with icon" size="m">
        <template #badge>
            <Badge color="red">
                <Icon :icon="mdiHeart" />
            </Badge>
        </template>
    </Avatar>
</template>

<script setup lang="ts">
import { mdiCheck, mdiClose, mdiHeart, mdiStar } from '@lumx/icons';
import { Avatar, Badge, Icon } from '@lumx/vue';
</script>
