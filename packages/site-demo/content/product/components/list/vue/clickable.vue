<template>
    <List>
        <ListItem size="tiny" :link-props="{ href: '#' }"> Clickable list item </ListItem>
        <ListItem size="tiny" :link-props="{ href: '#' }" :is-disabled="true"> Disabled clickable list item </ListItem>
        <ListItem size="tiny" :link-props="{ href: '#' }" :is-highlighted="true">
            Highlighted clickable list item
        </ListItem>
        <ListItem size="tiny" :link-props="{ href: '#' }" :is-selected="true"> Selected clickable list item </ListItem>
    </List>
</template>

<script setup lang="ts">
import { List, ListItem } from '@lumx/vue';
</script>
