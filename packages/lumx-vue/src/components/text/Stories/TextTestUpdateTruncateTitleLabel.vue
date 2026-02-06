<template>
    <div style="max-width: 300px">
        <button type="button" @click="lengthen">Lengthen text</button>
        <Text as="p" truncate v-bind="$attrs">
            {{ content }}
        </Text>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Text } from '@lumx/vue';

const content = ref('Some text');
const lengthen = () => {
    content.value = `${content.value} ${content.value}`;
};
</script>
