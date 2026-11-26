<template>
    <Tooltip label="Print" placement="left" force-open>
        <Icon :class="classNames.margin('huge')" has-shape :icon="mdiPrinter" />
    </Tooltip>

    <Tooltip label="Print" placement="bottom" force-open>
        <Icon :class="classNames.margin('huge')" has-shape :icon="mdiPrinter" />
    </Tooltip>

    <Tooltip label="Print" placement="top" force-open>
        <Icon :class="classNames.margin('huge')" has-shape :icon="mdiPrinter" />
    </Tooltip>

    <Tooltip label="Print" placement="right" force-open>
        <Icon :class="classNames.margin('huge')" has-shape :icon="mdiPrinter" />
    </Tooltip>
</template>

<script setup lang="ts">
import { mdiPrinter } from '@lumx/icons';
import { Icon, Tooltip } from '@lumx/vue';
import { classNames } from '@lumx/core/js/utils';
</script>
