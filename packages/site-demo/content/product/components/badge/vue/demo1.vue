<template>
    <Badge color="red">
        <span>4</span>
    </Badge>

    <Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar with label" size="m">
        <template #badge>
            <Badge color="red">
                <span>4</span>
            </Badge>
        </template>
    </Avatar>
</template>

<script setup lang="ts">
import { Avatar, Badge } from '@lumx/vue';
</script>
