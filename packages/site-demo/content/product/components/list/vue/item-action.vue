<template>
    <List item-padding="big">
        <ListItem>
            <template #before>
                <Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar" size="m" />
            </template>
            <template #after>
                <IconButton label="More" emphasis="low" :icon="mdiDotsHorizontal" />
            </template>
            <ListItem.Action as="a" href="https://example.com"> Clickable list item via action area </ListItem.Action>
            <Text as="p" color="dark" color-variant="L2">
                The entire list item is clickable, but the icon button remains independently clickable.
            </Text>
        </ListItem>

        <ListItem>
            <template #before>
                <Avatar image="https://i.pravatar.cc/128?img=45" alt="Avatar" size="m" />
            </template>
            <ListItem.Action @click="() => {}">Clickable list item with button action</ListItem.Action>
            <Text as="p" color="dark" color-variant="L2"> Uses a button as the primary action. </Text>
        </ListItem>
    </List>
</template>

<script setup lang="ts">
import { mdiDotsHorizontal } from '@lumx/icons';
import { Avatar, IconButton, List, ListItem, Text } from '@lumx/vue';
</script>
