<script lang="ts">
import { defineComponent, ref } from 'vue-demi';
import { IconProps, Icon as UI } from '@lumx/core/js/components/Icon';

export default defineComponent({
  name: 'Icon',
  components: {
    UI,
  },
  setup(props: IconProps) {
    return { props };
  },
});
</script>

<template>
  <UI
    v-bind="props"
    ref="iconRef"
  />
</template>