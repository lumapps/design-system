<script lang="ts">
import { defineComponent, ref } from 'vue-demi';
import { Theme } from '@lumx/core/js/constants';
import { IconProps, Icon as UI } from '@lumx/core/js/components/Icon';

export default defineComponent({
  name: 'Icon',
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
  },
  components: {
    UI,
  },
  setup(props: IconProps) {
    const iconRef = ref();

    return { props, iconRef };
  },
});
</script>

<template>
  <UI
    v-bind="props"
    ref="iconRef"
  />
</template>