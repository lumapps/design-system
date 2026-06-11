<template>
    <MenuButton :label="label" :emphasis="emphasis">
        <MenuItem @click="onItemClick">
            <template #action="{ actionProps }">
                <a v-bind="actionProps" href="#">HTML link</a>
            </template>
        </MenuItem>

        <MenuItem :after-icon="mdiOpenInNew" @click="onItemClick">
            <template #action="{ actionProps }">
                <CustomLink v-bind="actionProps" to="https://example.com" target="_blank">
                    Custom link target=_blank
                </CustomLink>
            </template>
        </MenuItem>
    </MenuButton>
</template>

<script setup lang="ts">
import type { Emphasis } from '@lumx/core/js/constants';
import { mdiOpenInNew } from '@lumx/icons';
import { MenuItem, MenuButton } from '@lumx/vue';
import CustomLink from '@lumx/vue/stories/utils/CustomLink.vue';

defineProps<{
    onItemClick?: (...args: any[]) => void;
    label: string;
    emphasis?: Emphasis;
}>();
</script>
