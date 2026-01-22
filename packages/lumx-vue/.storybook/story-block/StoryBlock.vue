<script setup lang="ts">
import { computed, watch } from 'vue';
import { classNames } from '@lumx/core/src/js/utils';
import isChromatic from 'chromatic/isChromatic';
import { toggleMaterialTheme } from './toggleMaterialTheme';
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

<style lang="scss" scoped>
  @import "@lumx/core/src/scss/design-tokens";
  @import "@lumx/core/src/scss/core";

  .story-block {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 1rem;
      overflow: auto;

      &--has-grey-background:not(&--theme-dark) {
          background: lightgray;
      }

      &--theme-dark {
          color: lumx-color-variant("light", "N");
          background: lumx-color-variant("dark", "N");
      }

      &__toolbar {
          display: flex;
          gap: $lumx-spacing-unit-big;
          margin-bottom: $lumx-spacing-unit-big;
      }
  }
</style>
