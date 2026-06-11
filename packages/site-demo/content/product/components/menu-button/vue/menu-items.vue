<template>
    <MenuButton label="Item options">
        <MenuItem :icon="mdiPencil" @click="() => alert('Edit')">Edit</MenuItem>
        <MenuItem :icon="mdiDelete" color="red" @click="() => alert('Delete')">Delete</MenuItem>
        <MenuDivider />
        <MenuItem :icon="mdiFileDocumentOutline" :after-icon="mdiOpenInNew">
            <template #action="{ actionProps }">
                <a v-bind="actionProps" href="https://example.com/docs" target="_blank">Documentation</a>
            </template>
        </MenuItem>
    </MenuButton>
</template>

<script setup lang="ts">
import { MenuButton, MenuItem, MenuDivider } from '@lumx/vue';
import {
    mdiBookOpenOutline,
    mdiContentCopy,
    mdiDelete,
    mdiFileDocumentOutline,
    mdiOpenInNew,
    mdiPencil,
} from '@lumx/icons';

const alert = window.alert;
</script>
