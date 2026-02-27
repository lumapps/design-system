<template>
    <div :class="classNames.join('lumx-color-background-primary-N', classNames.padding('big'))">
        <span class="lumx-color-font-light-N">The quick brown fox jumps over the lazy dog</span>
    </div>
</template>

<script setup>
import { classNames } from '@lumx/core/js/utils';
</script>
