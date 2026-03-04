<template>
    <Link href="#" color="dark"> Dark color link </Link>
    <div :class="classNames.join(classNames.padding(), classNames.background('dark'))">
        <Link href="#" color="light"> Light color link </Link>
    </div>
</template>

<script setup lang="ts">
import { classNames } from '@lumx/core/js/utils';
import { Link } from '@lumx/vue';
</script>
