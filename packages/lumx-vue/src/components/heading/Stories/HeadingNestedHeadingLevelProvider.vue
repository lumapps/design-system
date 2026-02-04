<template>
    <div>
        <!-- This will render a h1 -->
        <Heading>First level</Heading>
        <HeadingLevelProvider>
            <!-- This will render a h2 -->
            <Heading>Second Level</Heading>
            <HeadingLevelProvider>
                <!-- This will render a h3 -->
                <Heading>Third Level</Heading>
                <!-- This will also render a h3 -->
                <Heading>Other Third Level</Heading>
                <HeadingLevelProvider>
                    <!-- This will render a h4 -->
                    <Heading>Fourth Level</Heading>
                    <HeadingLevelProvider>
                        <!-- This will render a h5 -->
                        <Heading>Fifth Level</Heading>
                    </HeadingLevelProvider>
                </HeadingLevelProvider>
            </HeadingLevelProvider>
        </HeadingLevelProvider>
    </div>
</template>

<script setup lang="ts">
import { Heading, HeadingLevelProvider } from '@lumx/vue';
</script>
