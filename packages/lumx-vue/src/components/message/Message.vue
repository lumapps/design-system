<template>
    <ui v-bind="{ ...attrs, ...props }">
        <slot />
    </ui>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { Message as MessageUI, MessageProps } from '@lumx/core/js/components/Message';

import { VueToJSX } from '../../utils/VueToJSX';

defineOptions({
    inheritAttrs: false,
});

const props = defineProps<MessageProps>();
const attrs = useAttrs();
const ui = VueToJSX<MessageProps>(MessageUI);
</script>
