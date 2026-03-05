<template>
    <List>
        <ListSection label="Default">
            <ListItem size="big" :class="classNames.background('dark-L6')">
                <Text as="p">Two-line item</Text>
                <Text as="p" color="dark-L2"> Secondary text </Text>
            </ListItem>
        </ListSection>
    </List>

    <List item-padding="big">
        <ListSection label="Big padding">
            <ListItem size="big" :class="classNames.background('dark-L6')">
                <Text as="p">Two-line item</Text>
                <Text as="p" color="dark-L2"> Secondary text </Text>
            </ListItem>
        </ListSection>
    </List>

    <List item-padding="huge">
        <ListSection label="Huge padding">
            <ListItem size="big" :class="classNames.background('dark-L6')">
                <Text as="p">Two-line item</Text>
                <Text as="p" color="dark-L2"> Secondary text </Text>
            </ListItem>
        </ListSection>
    </List>
</template>

<script setup lang="ts">
import { classNames } from '@lumx/core/js/utils';
import { List, ListItem, ListSection, Text } from '@lumx/vue';
</script>
