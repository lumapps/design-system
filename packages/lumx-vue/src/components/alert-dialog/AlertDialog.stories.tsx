/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { Button, Link } from '@lumx/vue';
import { withChromaticForceScreenSize } from '@lumx/vue/stories/decorators/withChromaticForceScreenSize';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { setup } from '@lumx/core/js/components/AlertDialog/Stories';

import { AlertDialog } from '.';

/**
 * Story render component for AlertDialog.
 *
 * Defined as a standalone component so that:
 * - The button ref is created inside a proper Vue setup context.
 * - Storybook can pass args as reactive props (avoiding stale closure captures).
 * - Children are passed as the default slot.
 */
const AlertDialogStory = defineComponent(
    (_props: any, { attrs }: any) => {
        const buttonRef = ref<HTMLElement>();
        const isOpen = ref(true);

        return () => {
            const { children, ...props } = attrs;
            return (
                <>
                    <Button
                        ref={buttonRef}
                        onClick={() => {
                            isOpen.value = true;
                        }}
                    >
                        Open dialog
                    </Button>
                    <AlertDialog
                        {...props}
                        isOpen={isOpen.value}
                        parentElement={(buttonRef.value as any)?.$el}
                        onClose={() => {
                            isOpen.value = false;
                        }}
                    >
                        {children}
                    </AlertDialog>
                </>
            );
        };
    },
    { name: 'LumxAlertDialogStory', inheritAttrs: false },
);

const { meta, ...stories } = setup({
    component: AlertDialog,
    components: { Link },
    decorators: { withChromaticForceScreenSize, withNestedProps },
    render: (args: any) => () => <AlertDialogStory {...args} />,
});

export default {
    title: 'LumX components/alert-dialog/AlertDialog',
    ...meta,
};

export const DefaultKind = { ...stories.DefaultKind };
export const Warning = { ...stories.Warning };
export const Success = { ...stories.Success };
export const Error = { ...stories.Error };
export const WithCancel = { ...stories.WithCancel };
export const RichDescription = { ...stories.RichDescription };
