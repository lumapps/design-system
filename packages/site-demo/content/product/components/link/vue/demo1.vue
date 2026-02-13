<template>
    <Link href="#">Default link</Link>
    <Link href="#">
        <Icon :icon="mdiPencil" /> Link with an icon
    </Link>
</template>

<script setup lang="ts">
import { mdiPencil } from '@lumx/icons';
import { Icon, Link } from '@lumx/vue';
</script>
