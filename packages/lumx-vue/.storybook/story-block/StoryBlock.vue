<script setup lang="ts">
import { computed, provide, watch } from 'vue';
import { classNames } from '@lumx/core/src/js/utils';
import isChromatic from 'chromatic/isChromatic';
import 'focus-visible';

const props = defineProps<{
  context: any;
}>();

const appliedTheme = computed(() => {
    const { theme } = props.context.globals;
    const themeToUse = props.context.args.theme || theme;

    if (theme === '') {
        return undefined;
    }

    return themeToUse;
});

// Hard code today date for stable chromatic stories snapshots.
if (props.context.parameters) {
    props.context.parameters.today = isChromatic() ? new Date('May 25 2021 01:00') : new Date();
}

provide('theme', appliedTheme ? appliedTheme.value : undefined);

const isChromaticEnv = isChromatic();

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
