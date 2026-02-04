<template>
    <div>
        <button type="button" @click="lengthen">Lengthen text</button>
        <Text style="max-width: 300px" v-bind="$props">
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
