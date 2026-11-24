<template>
    <List>
        <ListItem size="tiny" :link-props="{ href: '#' }"> Clickable list item </ListItem>
        <ListItem size="tiny" :link-props="{ href: '#' }" is-disabled> Disabled clickable list item </ListItem>
        <ListItem size="tiny" :link-props="{ href: '#' }" is-highlighted> Highlighted clickable list item </ListItem>
        <ListItem size="tiny" :link-props="{ href: '#' }" is-selected> Selected clickable list item </ListItem>
    </List>
</template>

<script setup lang="ts">
import { List, ListItem } from '@lumx/vue';
</script>
