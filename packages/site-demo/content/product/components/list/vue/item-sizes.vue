<template>
    <List>
        <ListDivider />
        <ListItem size="tiny">Tiny list item</ListItem>
        <ListDivider />
        <ListItem size="regular">Regular list item</ListItem>
        <ListDivider />
        <ListItem size="big">Big list item</ListItem>
        <ListDivider />
        <ListItem size="huge">
            <Text as="p">Huge list item</Text>
            <Text as="p" color="dark-L2">
                Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter se differunt. Idque
                Caesaris facere voluntate liceret: sese habere
            </Text>
        </ListItem>
        <ListDivider />
    </List>
</template>

<script setup lang="ts">
import { List, ListDivider, ListItem, Text } from '@lumx/vue';
</script>
