<template>
    <TreeList v-model:value="value" aria-label="Food" selection-type="multiple">
        <TreeListItem label="Fruits" value="fruits">
            <TreeListItem label="Citrus">
                <TreeListItem label="Lemon" value="lemon" />
                <TreeListItem label="Orange" value="orange" />
            </TreeListItem>
            <TreeListItem label="Apple" value="apple" />
        </TreeListItem>
        <TreeListItem label="Vegetables" value="vegetables">
            <TreeListItem label="Leek" value="leek" />
            <TreeListItem label="Carrot" value="carrot" />
        </TreeListItem>
    </TreeList>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TreeList, TreeListItem } from '@lumx/vue';

const value = ref(['lemon', 'leek']);
</script>
