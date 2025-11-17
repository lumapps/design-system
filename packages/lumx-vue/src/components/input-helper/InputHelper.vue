
<template>
  <p :class="rootClassName">
    <slot v-if="$slots.default" />
  </p>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue-demi';
import { getProps } from '@lumx/core/components/input-helper';

export default defineComponent({
  name: 'InputHelper',
  props: {
    kind: {
      type: String,
    },
    theme: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const defaultTheme = inject('theme', 'light');
    const theme = props.theme || defaultTheme;
    const { className: rootClassName } = getProps({ ...props, theme });

    return {
      rootClassName,
      slots,
    };
  },
});
</script>
