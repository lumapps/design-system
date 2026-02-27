/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { mdiMenuDown } from '@lumx/icons';
import { setup } from '@lumx/core/js/components/PopoverDialog/Stories';
import { Button, IconButton } from '@lumx/vue';

import { PopoverDialog } from '.';

/**
 * Story render component for PopoverDialog with Button trigger.
 *
 * Defined as a standalone component so that:
 * - The anchor template ref is created inside a proper Vue setup context.
 * - Storybook can pass args as reactive props (avoiding stale closure captures).
 */
const PopoverDialogButtonStory = defineComponent(
    (_props: any, { attrs }: any) => {
        const anchorRef = ref<HTMLElement>();
        const isOpen = ref(false);

        const open = () => {
            isOpen.value = true;
        };
        const close = () => {
            isOpen.value = false;
        };

        return () => {
            const { label, ...props } = attrs;
            return (
                <>
                    <Button ref={anchorRef} onClick={open}>
                        Open popover
                    </Button>
                    <PopoverDialog
                        anchorRef={anchorRef}
                        isOpen={isOpen.value}
                        onClose={close}
                        placement="bottom"
                        class="lumx-spacing-padding-huge"
                        label={label as string}
                        {...props}
                    >
                        <Button onClick={close}>Close</Button>
                        <Button emphasis="medium">Other button</Button>
                    </PopoverDialog>
                </>
            );
        };
    },
    { name: 'PopoverDialogButtonStory', inheritAttrs: false },
);

/**
 * Story render component for PopoverDialog with IconButton trigger.
 */
const PopoverDialogIconButtonStory = defineComponent(
    (_props: any, { attrs }: any) => {
        const anchorRef = ref<HTMLElement>();
        const isOpen = ref(false);

        const open = () => {
            isOpen.value = true;
        };
        const close = () => {
            isOpen.value = false;
        };

        return () => {
            const { label, ...props } = attrs;
            return (
                <>
                    <IconButton label="Open popover" ref={anchorRef} onClick={open} icon={mdiMenuDown} />
                    <PopoverDialog
                        anchorRef={anchorRef}
                        isOpen={isOpen.value}
                        onClose={close}
                        placement="bottom"
                        class="lumx-spacing-padding-huge"
                        label={label as string}
                        {...props}
                    >
                        <Button onClick={close}>Close</Button>
                    </PopoverDialog>
                </>
            );
        };
    },
    { name: 'PopoverDialogIconButtonStory', inheritAttrs: false },
);

const { meta, ...stories } = setup({
    component: PopoverDialog,
    components: { Button, IconButton },
    render: (args: any) => () => <PopoverDialogButtonStory {...args} />,
});

export default {
    title: 'LumX components/popover-dialog/PopoverDialog',
    ...meta,
};

export const WithButtonTrigger = { ...stories.WithButtonTrigger };

export const WithIconButtonTrigger = {
    ...stories.WithIconButtonTrigger,
    render: (args: any) => () => <PopoverDialogIconButtonStory {...args} />,
};
