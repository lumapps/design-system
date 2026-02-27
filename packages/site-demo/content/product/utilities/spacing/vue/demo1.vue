<template>
    <div style="border: 1px dashed rgba(40, 51, 109, 0.2)">
        <div
            :class="
                classNames.join(
                    'lumx-color-background-primary-N',
                    classNames.margin('vertical', 'big'),
                    classNames.margin('left', 'huge'),
                )
            "
            style="height: 100px"
        />
    </div>
</template>

<script setup>
import { classNames } from '@lumx/core/js/utils';
</script>
