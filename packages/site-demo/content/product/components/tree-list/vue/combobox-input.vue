<template>
    <Combobox.Provider>
        <Combobox.Input v-model:value="text" label="Filter foods" selection-mode="clear" placeholder="Lemon, leek…" />
        <TreeList v-model:value="value" aria-label="Food">
            <TreeListItem label="Fruits" value="fruits">
                <TreeListItem label="Citrus">
                    <TreeListItem label="Lemon" value="lemon" />
                    <TreeListItem label="Orange" value="orange" />
                </TreeListItem>
                <TreeListItem label="Apple" value="apple" description="Red or green" />
            </TreeListItem>
            <TreeListItem label="Vegetables" value="vegetables">
                <TreeListItem label="Leek" value="leek" />
                <TreeListItem label="Carrot" value="carrot" />
            </TreeListItem>
        </TreeList>
        <Combobox.State
            empty-message="No food found"
            :nb-option-message="(count: number) => `${count} matching item(s)`"
        />
    </Combobox.Provider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Combobox, TreeList, TreeListItem } from '@lumx/vue';

const text = ref('');
const value = ref<string>();
</script>
