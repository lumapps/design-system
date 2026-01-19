<script setup lang="ts">
import { computed, watch } from 'vue';
import { classNames } from '@lumx/core/src/js/utils';
import isChromatic from 'chromatic/isChromatic';
import { toggleMaterialTheme } from './toggleMaterialTheme';
import '@lumx/core/scss/lumx.scss';
import './index.scss';
import 'focus-visible';

const props = defineProps<{
  context: any;
}>();

const appliedTheme = computed(() => {
    const { theme } = props.context.globals;
    return props.context.args.theme || theme;
});

// Hard code today date for stable chromatic stories snapshots.
if (props.context.parameters) {
    props.context.parameters.today = isChromatic() ? new Date('May 25 2021 01:00') : new Date();
}

const isChromaticEnv = isChromatic();

watch(() => props.context.globals.materialTheme, (newVal) => {
    toggleMaterialTheme(newVal !== 'true');
}, { immediate: true });

const classes = computed(() => classNames.join(
    'story-block',
    props.context.parameters.hasGreyBackground && 'story-block--has-grey-background',
    `story-block--theme-${appliedTheme.value}`
));
</script>

<template>
  <slot v-if="isChromaticEnv" />
  <div v-else :class="classes">
    <slot />
  </div>
</template>
