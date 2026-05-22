<template>
    <!-- Default select button (customized with the basic Button props) -->
    <SelectButton
        label="Select a fruit"
        :options="FRUITS"
        :get-option-id="String"
        :value="defaultValue"
        @change="(newValue) => (defaultValue = newValue)"
        size="s"
        emphasis="low"
        color="red"
    />

    <!-- IconButton select button -->
    <SelectButton
        label="Select a fruit"
        label-display-mode="show-tooltip"
        :options="FRUITS"
        :get-option-id="String"
        :value="iconValue"
        @change="(newValue) => (iconValue = newValue)"
    >
        <template #button="{ buttonProps, label }">
            <IconButton
                v-bind="buttonProps"
                emphasis="medium"
                :icon="mdiFoodApple"
                :label="label"
                :is-selected="!!iconValue"
            />
        </template>
    </SelectButton>

    <!-- Chip select button -->
    <SelectButton
        label="Select a fruit"
        :options="FRUITS"
        :get-option-id="String"
        :value="chipValue"
        @change="(newValue) => (chipValue = newValue)"
    >
        <template #button="{ buttonProps, children }">
            <Chip v-bind="buttonProps" :is-clickable="true" :is-selected="!!chipValue">
                {{ children }}
                <template #after>
                    <Icon :icon="mdiMenuDown" />
                </template>
            </Chip>
        </template>
        <template #option="{ option }">
            <SelectButtonOption :value="option">
                <strong>{{ option }}</strong>
            </SelectButtonOption>
        </template>
    </SelectButton>

    <!-- Link select button (visually a link but functionally a button) -->
    <SelectButton
        label="Select a fruit"
        :options="FRUITS"
        :get-option-id="String"
        :value="linkValue"
        @change="(newValue) => (linkValue = newValue)"
    >
        <template #button="{ buttonProps, children }">
            <Link v-bind="buttonProps">{{ children }} <Icon :icon="mdiMenuDown" /></Link>
        </template>
    </SelectButton>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Chip, Icon, IconButton, Link, SelectButton, SelectButtonOption } from '@lumx/vue';
import { mdiFoodApple, mdiMenuDown } from '@lumx/icons';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange'];

const defaultValue = ref<string>();
const iconValue = ref<string>();
const chipValue = ref<string>();
const linkValue = ref<string>();
</script>
