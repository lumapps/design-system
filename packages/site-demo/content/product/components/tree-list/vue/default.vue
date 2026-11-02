<template>
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
        <TreeListItem label="Drinks">
            <TreeListItem label="Lemonade" value="lemonade" />
            <TreeListItem label="Water" value="water" />
        </TreeListItem>
    </TreeList>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TreeList, TreeListItem } from '@lumx/vue';

const value = ref('lemon');
</script>
