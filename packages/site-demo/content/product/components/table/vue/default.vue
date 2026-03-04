<template>
    <Table :has-dividers="true" :theme="theme" :style="{ minWidth: '620px' }">
        <TableHeader>
            <TableRow>
                <TableCell
                    v-for="header in tableHeader"
                    :key="header.name"
                    :icon="header.icon"
                    :is-sortable="header.isSortable"
                    :sort-order="header.sortOrder"
                    variant="head"
                    :width="header.width"
                    @headerClick="header.isSortable ? toggleSort(header) : undefined"
                >
                    {{ header.label }}
                </TableCell>
            </TableRow>
        </TableHeader>

        <TableBody>
            <TableRow v-for="body in tableBody" :key="body.id">
                <TableCell>
                    <FlexBox orientation="horizontal" horizontal-align="center">
                        <Thumbnail
                            :class="classNames.margin('right', 'big')"
                            :image="body.image"
                            aspect-ratio="square"
                            :alt="body.dessert"
                            size="m"
                            variant="rounded"
                        />
                        <Link :color="theme === 'dark' ? 'light' : 'dark'" href="./">
                            <span class="lumx-typography-subtitle1">{{ body.dessert }}</span>
                        </Link>

                        <FlexBox orientation="horizontal" horizontal-align="center" margin-auto="left">
                            <IconButton
                                emphasis="low"
                                :icon="mdiInformationOutline"
                                label="Informations"
                                :theme="theme"
                            />
                            <IconButton emphasis="low" :icon="mdiDotsVertical" label="More options" :theme="theme" />
                        </FlexBox>
                    </FlexBox>
                </TableCell>
                <TableCell>{{ String(body.calories) }}</TableCell>
                <TableCell>{{ String(body.fat) }}</TableCell>
                <TableCell>{{ body.comments }}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import orderBy from 'lodash/orderBy';
import { mdiCommentOutline, mdiDotsVertical, mdiInformationOutline } from '@lumx/icons';
import { classNames } from '@lumx/core/js/utils';
import {
    FlexBox,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    Thumbnail,
    type Theme,
    type ThOrder,
} from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const initialTable = [
    {
        calories: 159,
        comments: 'Lorem ipsum',
        dessert: 'Frozen yogurt',
        fat: 6.0,
        id: 1,
        image: 'https://picsum.photos/id/256/800/546',
    },
    {
        calories: 237,
        comments: 'Lorem ipsum',
        dessert: 'Ice cream sandwich',
        fat: 9.0,
        id: 2,
        image: 'https://picsum.photos/id/535/640/480',
    },
    {
        calories: 262,
        comments: 'Lorem ipsum',
        dessert: 'Eclair',
        fat: 16.0,
        id: 3,
        image: 'https://picsum.photos/id/24/640/480',
    },
];

const initialHeaders: Array<{
    isSortable: boolean;
    label: string;
    name: string;
    width?: string;
    sortOrder?: ThOrder;
    icon?: string;
}> = [
    {
        isSortable: true,
        label: 'Dessert',
        name: 'dessert',
    },
    {
        isSortable: true,
        label: 'Calories',
        name: 'calories',
        width: '100',
    },
    {
        isSortable: true,
        label: 'Fat (g)',
        name: 'fat',
        sortOrder: 'asc',
        width: '100',
    },
    {
        icon: mdiCommentOutline,
        isSortable: false,
        label: 'Comments',
        name: 'comments',
        width: '150',
    },
];

const tableHeader = ref(initialHeaders);
const tableBody = ref(initialTable);

const toggleSort = (header: (typeof initialHeaders)[number]) => {
    const sortOrder = header.sortOrder === 'asc' ? 'desc' : 'asc';
    tableHeader.value = tableHeader.value.map((h) => ({
        ...h,
        sortOrder: h.name === header.name ? sortOrder : undefined,
    }));
    tableBody.value = orderBy(tableBody.value, header.name, sortOrder);
};
</script>
