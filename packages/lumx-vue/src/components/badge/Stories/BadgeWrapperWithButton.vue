<template>
    <BadgeWrapper v-bind="$attrs">
        <template #badge>
            <Badge :color="ColorPalette.red">
                <Icon :icon="mdiHeart" />
            </Badge>
        </template>
        <Button>Some button</Button>
    </BadgeWrapper>
</template>

<script setup lang="ts">
import { BadgeWrapper, Badge, Button, Icon, ColorPalette } from '@lumx/vue';
import { mdiHeart } from '@lumx/icons';
</script>
