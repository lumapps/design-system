<script lang="ts">
import { defineComponent, inject, ref, defineProps } from 'vue-demi';
import { Theme } from '@lumx/core/js/constants';
import { IconProps, Icon as UI } from '@lumx/core/js/components/Icon';

export default defineComponent({
  name: 'Icon',
  props: defineProps<IconProps>(),
  components: {
    UI,
  },
  setup(props: IconProps, { expose }) {
    const injectedTheme = inject('theme', undefined);

    const iconRef = ref();
    expose({ iconRef });

    return { props, theme: injectedTheme || props.theme, iconRef };
  },
});
</script>

<template>
  <UI
    v-bind="props"
    :theme="props.theme || injectedTheme"
    ref="iconRef"
  />
</template>