<template>
    <Button :left-icon="mdiPlay" ref="buttonRef" @click="toggle" :theme="theme">Open processing dialog</Button>

    <Dialog :is-open="isOpen" :is-loading="true" :parent-element="buttonRef?.$el" @close="close">
        <template #header>
            <Toolbar>
                <Text as="span" typography="title">Default dialog</Text>
            </Toolbar>
        </template>

        <p class="lumx-spacing-padding-horizontal-huge">
            Nihil hic munitissimus habendi senatus locus, nihil horum? At nos hinc posthac, sitientis piros Afros. Magna
            pars studiorum, prodita quaerimus. Integer legentibus erat a ante historiarum dapibus. Praeterea iter est
            quasdam res quas ex communi. Ullamco laboris nisi ut aliquid ex ea commodi consequat. Inmensae subtilitatis,
            obscuris et malesuada fames. Me non paenitet nullum festiviorem excogitasse ad hoc. Cum ceteris in
            veneratione tui montes, nascetur mus. Etiam habebis sem dicantur magna mollis euismod. Quis aute iure
            reprehenderit in voluptate velit esse. Phasellus laoreet lorem vel dolor tempus vehicula.
        </p>

        <template #footer>
            <Toolbar>
                <template #after>
                    <Button emphasis="medium" @click="close">Cancel</Button>
                    <Button class="lumx-spacing-margin-left-regular" @click="close">Save</Button>
                </template>
            </Toolbar>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mdiPlay } from '@lumx/icons';
import { Button, Dialog, Text, Toolbar, type Theme } from '@lumx/vue';

defineProps<{ theme?: Theme }>();

const buttonRef = ref<InstanceType<typeof Button>>();
const isOpen = ref(false);
const close = () => { isOpen.value = false; };
const toggle = () => { isOpen.value = !isOpen.value; };
</script>
