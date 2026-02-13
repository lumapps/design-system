<template>
    <Badge color="green">
        <Icon :icon="mdiCheck" />
    </Badge>

    <Badge color="red">
        <Icon :icon="mdiClose" />
    </Badge>
</template>

<script setup lang="ts">
import { mdiCheck, mdiClose } from '@lumx/icons';
import { Badge, Icon } from '@lumx/vue';
</script>
