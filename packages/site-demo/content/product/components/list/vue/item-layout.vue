<template>
    <List>
        <ListItem>Simple item</ListItem>
        <ListItem>
            <Text as="p">Multi-line item</Text>
            <Text as="p" color="dark-L2"> Secondary text </Text>
        </ListItem>
    </List>

    <List>
        <ListItem>
            <template #before>
                <Icon :icon="mdiSend" size="xs" :has-shape="true" />
            </template>
            Item with icon before
        </ListItem>

        <ListItem>
            <template #before>
                <Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar" size="m" />
            </template>
            <template #after>
                <Button emphasis="medium" size="s"> Button </Button>
            </template>
            <Text as="p">Item with before and after</Text>
            <Text as="p" color="dark-L2"> Secondary text </Text>
        </ListItem>
    </List>
</template>

<script setup lang="ts">
import { mdiSend } from '@lumx/icons';
import { Avatar, Button, Icon, List, ListItem, Text } from '@lumx/vue';
</script>
