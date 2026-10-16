<template>
    <Button ref="anchorRef" aria-haspopup="dialog" :aria-expanded="String(isOpen)" @click="isOpen = !isOpen">
        <span id="pick-fruit-label">Pick a fruit</span>{{ value ? `: ${value.name}` : '' }}
    </Button>
    <PopoverDialog
        :anchor-ref="anchorRef"
        :is-open="isOpen"
        label="Pick a fruit"
        placement="bottom-start"
        max-height="300px"
        :focus-element="inputElement"
        @close="isOpen = false"
    >
        <FlexBox ref="content" orientation="vertical">
            <SelectTextField
                selection-type="single"
                label=""
                :input-props="{ 'aria-labelledby': 'pick-fruit-label' }"
                :has-clear-button="false"
                :class="FIELD_MARGINS"
                placeholder="Search fruits..."
                :options="items"
                filter="auto"
                get-option-id="id"
                get-option-name="name"
                :value="value"
                :translations="TRANSLATIONS"
                :popover-props="false"
                @change="handleChange"
                @load-more="onLoadMore"
            />
        </FlexBox>
    </PopoverDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { classNames } from '@lumx/core/js/utils';
import { Button, FlexBox, PopoverDialog, SelectTextField } from '@lumx/vue';

interface Fruit {
    id: string;
    name: string;
}

const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple' },
    { id: 'apricot', name: 'Apricot' },
    { id: 'banana', name: 'Banana' },
    { id: 'blueberry', name: 'Blueberry' },
    { id: 'cherry', name: 'Cherry' },
    { id: 'grape', name: 'Grape' },
    { id: 'lemon', name: 'Lemon' },
    { id: 'orange', name: 'Orange' },
    { id: 'peach', name: 'Peach' },
    { id: 'strawberry', name: 'Strawberry' },
];

const FIELD_MARGINS = classNames.margins([
    { direction: 'vertical', size: 'regular' },
    { direction: 'horizontal', size: 'big' },
]);

const anchorRef = ref();
// Focus the input when the dialog opens (the Vue SelectTextField does not expose its input ref).
const content = ref();
const inputElement = computed(() => content.value?.$el?.querySelector('input') ?? undefined);
const isOpen = ref(false);
const value = ref<Fruit>();
// Start with 3 pages of items so the list overflows the dialog.
const items = ref<Fruit[]>(
    Array.from({ length: 3 }).flatMap((_, page) =>
        FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${page * FRUITS.length + i}` })),
    ),
);

// Close the dialog on selection (focus goes back to the button).
function handleChange(newValue: Fruit | undefined) {
    value.value = newValue;
    if (newValue) {
        isOpen.value = false;
    }
}

function onLoadMore() {
    if (items.value.length >= 200) {
        return;
    }
    const offset = items.value.length;
    items.value = [...items.value, ...FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${offset + i}` }))];
}
</script>
