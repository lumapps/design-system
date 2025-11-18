<script lang="ts">
import { defineComponent, inject, ref } from 'vue-demi';
import { Icon as UI } from '@lumx/core/js/components/Icon';

export default defineComponent({
  name: 'Icon',
  props: {
    theme: {
      type: String,
      default: undefined,
    },
  },
  components: {
    UI,
  },
  setup(props) {
    const theme = inject('theme', undefined);
    const iconRef = ref();
    return { props, theme, iconRef };
  },
});
</script>

<template>
  <UI
    v-bind="props"
    :theme="props.theme || theme"
    ref="iconRef"
  />
</template>