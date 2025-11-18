<template>
  <UI v-bind="{props}">
    <Icon :icon="mdiAbTesting" />
  </UI>
</template>

<script lang="ts">
import Vue from 'vue';
import { defineComponent } from '@vue/composition-api';
import { InputHelper as UI } from '@lumx/core/js/components/InputHelper';
import { reactToVue2 } from '../utils/reactToVue2';
import { Icon } from '../icon';
import { mdiAbTesting } from '@lumx/icons';
// import type { IconProps, IconSizes } from '@lumx/core/js/components/Icon';

export default defineComponent({
  name: 'InputHelper',
  props: {
    icon: {
      type: String,
      required: true,
      // SVG path string
    },
    color: {
      type: String,
      required: false,
      default: undefined,
      // ColorWithVariants
    },
    colorVariant: {
      type: String,
      required: false,
      default: undefined,
      // ColorVariant
    },
    hasShape: {
      type: Boolean,
      required: false,
      default: false,
    },
    size: {
      type: String,
      required: false,
      default: undefined,
      // IconSizes
    },
    alt: {
      type: String,
      required: false,
      default: undefined,
    },
    theme: {
      type: String,
      required: false,
      default: undefined,
      // Theme
    },
  },
  components: {
    UI: reactToVue2(UI),
    Icon,
  },
  data() {
    return {
      mdiAbTesting,
    };
  },
  setup(props) {
    console.log(props); // Uncomment for debugging
    return {
      props,
    };
  },
});
</script>
