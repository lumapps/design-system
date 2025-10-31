<script lang="ts" setup>
import { inject } from 'vue';

import { Theme } from '@lumx/react';
import { getProps, InputHelperProps } from '@lumx/core/components/input-helper';

const props = defineProps<InputHelperProps>();
const defaultTheme = inject('theme', Theme.light);
const theme = props.theme || defaultTheme;
const { className: rootClassName } = getProps({ ...props, theme });
</script>

<template>
    <p :class="rootClassName">
        <slot v-if="$slots.default" />
    </p>
</template>
