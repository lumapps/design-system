<template>
    <Toolbar>
        <Heading typography="title">Toolbar title</Heading>
        <template #after>
            <Button emphasis="low" :left-icon="mdiTranslate" :right-icon="mdiMenuDown">
                Value
            </Button>
        </template>
    </Toolbar>
</template>

<script setup lang="ts">
import { mdiMenuDown, mdiTranslate } from '@lumx/icons';
import { Button, Toolbar, Heading } from '@lumx/vue';
</script>
