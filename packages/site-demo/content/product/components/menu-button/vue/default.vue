<template>
    <MenuButton label="Menu button">
        <MenuItem :icon="mdiAccount" @click="() => alert('Profile')">Profile</MenuItem>
        <MenuItem :icon="mdiCog" @click="() => alert('Settings')">Settings</MenuItem>
        <MenuDivider />
        <MenuItem :icon="mdiLogout" @click="() => alert('Logout')">Logout</MenuItem>
    </MenuButton>
</template>

<script setup lang="ts">
import { MenuButton, MenuItem, MenuDivider } from '@lumx/vue';
import { mdiAccount, mdiCog, mdiLogout } from '@lumx/icons';

const alert = window.alert;
</script>
