<template>
    <TreeList aria-label="Food" :value="value" @change="value = $event as string">
        <TreeListSection label="Food">
            <TreeListItem label="Fruits" value="fruits">
                <TreeListItem label="Lemon" value="lemon" />
                <TreeListItem label="Apple" value="apple" />
            </TreeListItem>
            <TreeListItem label="Vegetables" value="vegetables">
                <TreeListItem label="Leek" value="leek" />
                <TreeListItem label="Carrot" value="carrot" />
            </TreeListItem>
        </TreeListSection>
        <TreeListSection>
            <TreeListItem label="Drinks">
                <TreeListItem label="Lemonade" value="lemonade" />
                <TreeListItem label="Water" value="water" />
            </TreeListItem>
        </TreeListSection>
    </TreeList>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TreeList, TreeListItem, TreeListSection } from '@lumx/vue';

const value = ref('lemon');
</script>
