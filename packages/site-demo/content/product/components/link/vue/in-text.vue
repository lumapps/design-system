<template>
    <Text as="p">
        Links inside a paragraph are <Link href="#">underlined by default</Link> so they remain distinguishable from
        the surrounding text.
    </Text>
</template>

<script setup lang="ts">
import { Link, Text } from '@lumx/vue';
</script>
