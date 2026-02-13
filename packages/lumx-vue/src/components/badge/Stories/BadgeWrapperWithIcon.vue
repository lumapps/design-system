<template>
    <BadgeWrapper v-bind="$attrs">
        <template #badge>
            <Badge :color="ColorPalette.red">
                <Icon :icon="mdiHeart" />
            </Badge>
        </template>
        <Icon :icon="mdiAccount" :size="Size.m" :color="ColorPalette.dark" />
    </BadgeWrapper>
</template>

<script setup lang="ts">
import { BadgeWrapper, Badge, Icon, ColorPalette, Size } from '@lumx/vue';
import { mdiAccount, mdiHeart } from '@lumx/icons';
</script>
