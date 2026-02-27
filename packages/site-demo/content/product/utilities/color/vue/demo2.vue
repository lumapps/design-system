<template>
    <div :class="classNames.join(classNames.background('primary'), classNames.padding('big'))">
        <span :class="classNames.font('light')">The quick brown fox jumps over the lazy dog</span>
    </div>
</template>

<script setup>
import { classNames } from '@lumx/core/js/utils';
</script>
