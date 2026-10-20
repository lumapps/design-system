<template>
    <div>
        <Combobox.Provider>
            <Combobox.Input :value="text" selection-mode="keep" placeholder="Filter foods…" @change="text = $event" />
            <TreeList aria-label="Food" :value="value" @change="value = $event as string">
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
                :nb-option-message="(count: number) => `${count} result(s)`"
            />
        </Combobox.Provider>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Combobox, TreeList, TreeListItem } from '@lumx/vue';

const text = ref('');
const value = ref<string>();
</script>
