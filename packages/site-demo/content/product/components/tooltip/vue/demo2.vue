<template>
    <Tooltip label="Print" placement="left" :force-open="true">
        <Icon :class="classNames.margin('all', 'huge')" :has-shape="true" :icon="mdiPrinter" />
    </Tooltip>

    <Tooltip label="Print" placement="bottom" :force-open="true">
        <Icon :class="classNames.margin('all', 'huge')" :has-shape="true" :icon="mdiPrinter" />
    </Tooltip>

    <Tooltip label="Print" placement="top" :force-open="true">
        <Icon :class="classNames.margin('all', 'huge')" :has-shape="true" :icon="mdiPrinter" />
    </Tooltip>

    <Tooltip label="Print" placement="right" :force-open="true">
        <Icon :class="classNames.margin('all', 'huge')" :has-shape="true" :icon="mdiPrinter" />
    </Tooltip>
</template>

<script setup lang="ts">
import { mdiPrinter } from '@lumx/icons';
import { Icon, Tooltip } from '@lumx/vue';
import { classNames } from '@lumx/core/js/utils';
</script>
