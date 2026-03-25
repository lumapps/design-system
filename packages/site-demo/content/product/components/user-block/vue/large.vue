<template>
    <UserBlock
        :theme="theme"
        name="Emmitt O. Lum"
        :name-props="{ 'aria-label': 'Emmitt O. Lum - open user profile' }"
        :fields="['Creative developer', 'Denpasar']"
        :avatar-props="{ image: 'https://i.pravatar.cc/128?img=32' }"
        size="l"
        @click="console.log"
    />
</template>

<script setup lang="ts">
import { UserBlock, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();
</script>
