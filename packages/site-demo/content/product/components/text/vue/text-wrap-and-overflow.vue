<template>
    <div style="max-width: 180px; overflow: hidden">
        <code>default</code>
        <Text as="p" typography="body2"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. </Text>
    </div>
    <div style="max-width: 180px; overflow: hidden">
        <code>no wrap</code>
        <Text as="p" typography="body2" :no-wrap="true"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. </Text>
    </div>
    <div style="max-width: 180px; overflow: hidden">
        <code>truncate</code>
        <Text as="p" typography="body2" :truncate="true"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. </Text>
    </div>
    <div style="max-width: 180px; overflow: hidden">
        <code>truncate multiline</code>
        <Text as="p" typography="body2" :truncate="{ lines: 2 }">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
    </div>
</template>

<script setup lang="ts">
import { Text } from '@lumx/vue';
</script>
