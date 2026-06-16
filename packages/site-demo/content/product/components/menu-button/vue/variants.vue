<template>
    <!-- Default trigger, medium emphasis, small size -->
    <MenuButton label="Actions" emphasis="medium" size="s">
        <MenuItem @click="() => alert('Edit')">Edit</MenuItem>
        <MenuItem @click="() => alert('Duplicate')">Duplicate</MenuItem>
        <MenuDivider />
        <MenuItem @click="() => alert('Delete')">Delete</MenuItem>
    </MenuButton>

    <!-- Icon button trigger -->
    <MenuButton label="Actions" variant="icon-button" emphasis="low">
        <MenuItem @click="() => alert('Edit')">Edit</MenuItem>
        <MenuItem @click="() => alert('Duplicate')">Duplicate</MenuItem>
        <MenuDivider />
        <MenuItem @click="() => alert('Delete')">Delete</MenuItem>
    </MenuButton>

    <!-- Chip trigger -->
    <MenuButton label="Actions" variant="chip">
        <MenuItem @click="() => alert('Edit')">Edit</MenuItem>
        <MenuItem @click="() => alert('Duplicate')">Duplicate</MenuItem>
        <MenuDivider />
        <MenuItem @click="() => alert('Delete')">Delete</MenuItem>
    </MenuButton>

    <!-- Link trigger -->
    <MenuButton label="Actions" variant="link">
        <MenuItem @click="() => alert('Edit')">Edit</MenuItem>
        <MenuItem @click="() => alert('Duplicate')">Duplicate</MenuItem>
        <MenuDivider />
        <MenuItem @click="() => alert('Delete')">Delete</MenuItem>
    </MenuButton>
</template>

<script setup lang="ts">
import { MenuButton, MenuItem, MenuDivider } from '@lumx/vue';

const alert = window.alert;
</script>
