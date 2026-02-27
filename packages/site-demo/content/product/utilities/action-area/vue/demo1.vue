<template>
    <FlexBox
        as="article"
        orientation="vertical"
        gap="regular"
        :class="classNames.join(classNames.actionArea(), classNames.padding('regular'))"
    >
        <Heading as="h2">
            <Link
                :class="classNames.actionArea.action({ 'has-overlay': true, 'focus-outset': true })"
                href="https://example.com"
            >
                Card title
            </Link>
        </Heading>
        <Text as="p">Hover to see the overlay. The button below is independently clickable.</Text>
        <Button size="s" emphasis="medium" @click="window.alert('Secondary action clicked!')">Secondary action</Button>
    </FlexBox>
</template>

<script setup>
import { classNames } from '@lumx/core/js/utils';
import { Button, FlexBox, Link, Text, Heading } from '@lumx/vue';
</script>
