<template>
    <article :class="classNames.padding('left', 'big')">
        <HeadingLevelProvider>
            <Heading>Article 1 title</Heading>
            <Text as="p" typography="body1">Article content</Text>
            <article :class="classNames.padding('left', 'big')">
                <HeadingLevelProvider>
                    <Heading>Article 1.1 title</Heading>
                    <Text as="p" typography="body1">Article content</Text>
                    <article :class="classNames.padding('left', 'big')">
                        <HeadingLevelProvider>
                            <Heading>Article 1.1.1 title</Heading>
                            <Text as="p" typography="body1">Article content</Text>
                        </HeadingLevelProvider>
                    </article>
                </HeadingLevelProvider>
            </article>
            <article :class="classNames.padding('left', 'big')">
                <HeadingLevelProvider>
                    <Heading>Article 1.2 title</Heading>
                    <Text as="p" typography="body1">Article content</Text>
                </HeadingLevelProvider>
            </article>
        </HeadingLevelProvider>
    </article>
</template>

<script setup lang="ts">
import { classNames } from '@lumx/core/js/utils';
import { Heading, HeadingLevelProvider, Text } from '@lumx/vue';
</script>
