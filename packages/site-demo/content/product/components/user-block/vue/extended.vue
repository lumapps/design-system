<template>
    <UserBlock
        :theme="theme"
        name="Emmitt O. Lum"
        :name-props="{ 'aria-label': 'Emmitt O. Lum - open user profile' }"
        :fields="['Creative developer', 'Denpasar']"
        :avatar-props="{ image: 'https://i.pravatar.cc/128?img=32' }"
        size="l"
        orientation="vertical"
        @click="console.log"
    >
        <template #simple-action>
            <Button emphasis="medium" :color="theme === 'dark' ? 'light' : undefined" size="s" :theme="theme">
                Follow
            </Button>
        </template>
        <template #multiple-actions>
            <IconButton
                v-for="(action, idx) in demoActions"
                :key="idx"
                :label="action.label"
                emphasis="low"
                :color="theme === 'dark' ? 'light' : undefined"
                :icon="action.icon"
                :theme="theme"
            />
        </template>
    </UserBlock>
</template>

<script setup lang="ts">
import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';
import { Button, IconButton, UserBlock, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const demoActions = [
    { label: 'Copy phone number', icon: mdiPhone },
    { label: 'Copy cell phone number', icon: mdiCellphone },
    { label: 'Mail to', icon: mdiEmail },
    { label: 'Contact on google hangout', icon: mdiGoogleHangouts },
    { label: 'Contact on slack', icon: mdiSlack },
];
</script>
