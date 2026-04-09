/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { mdiClose } from '@lumx/icons';
import { Button, Checkbox, FlexBox, Heading, IconButton, TextField, Toolbar } from '@lumx/vue';
import { withChromaticForceScreenSize } from '@lumx/vue/stories/decorators/withChromaticForceScreenSize';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { setup } from '@lumx/core/js/components/Dialog/Stories';

import { Dialog } from '.';

/**
 * Story render component for Dialog.
 *
 * Defined as a standalone component so that:
 * - The button ref is created inside a proper Vue setup context.
 * - Storybook can pass args as reactive props (avoiding stale closure captures).
 * - Header/footer/children args are mapped to Vue named slots.
 */
const DialogStory = defineComponent(
    (_props: any, { attrs }: any) => {
        const buttonRef = ref<HTMLElement>();
        const isOpen = ref(true);

        return () => {
            const { children, header, footer, ...props } = attrs;
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
                    <Dialog
                        {...props}
                        isOpen={isOpen.value}
                        onClose={() => {
                            isOpen.value = false;
                        }}
                        parentElement={(buttonRef.value as any)?.$el}
                    >
                        {{
                            ...(header ? { header: () => header } : {}),
                            default: () => children,
                            ...(footer ? { footer: () => footer } : {}),
                        }}
                    </Dialog>
                </>
            );
        };
    },
    { name: 'LumxDialogStory', inheritAttrs: false },
);

const { meta, ...stories } = setup({
    component: Dialog,
    decorators: { withChromaticForceScreenSize },
    render: (args: any) => () => <DialogStory {...args} />,
});

export default {
    title: 'LumX components/dialog/Dialog',
    ...meta,
};

export const Default = { ...stories.Default };
export const Loading = { ...stories.Loading };
export const WithHeaderFooter = { ...stories.WithHeaderFooter };
export const ForceDivider = { ...stories.ForceDivider };
export const LongContent = { ...stories.LongContent };
export const PreventAutoClose = { ...stories.PreventAutoClose };
export const PreventCloseOnEscape = { ...stories.PreventCloseOnEscape };
export const PreventCloseOnClick = { ...stories.PreventCloseOnClick };

/**
 * More complex header/footer using Vue named slots
 */
export const WithHeaderFooterChildren = {
    render: () => {
        const WithHeaderFooterChildrenStory = defineComponent(
            () => {
                const buttonRef = ref<HTMLElement>();
                const isOpen = ref(true);

                return () => (
                    <>
                        <Button
                            ref={buttonRef}
                            onClick={() => {
                                isOpen.value = true;
                            }}
                        >
                            Open dialog
                        </Button>
                        <Dialog
                            isOpen={isOpen.value}
                            onClose={() => {
                                isOpen.value = false;
                            }}
                            parentElement={(buttonRef.value as any)?.$el}
                        >
                            {{
                                header: () => (
                                    <Toolbar>
                                        {{
                                            default: () => <Heading typography="title">Dialog heading</Heading>,
                                            after: () => <IconButton label="Close" emphasis="low" icon={mdiClose} />,
                                        }}
                                    </Toolbar>
                                ),
                                default: () => <div class="lumx-spacing-padding-huge">{loremIpsum('short')}</div>,
                                footer: () => <Toolbar>{{ after: () => <Button>Close</Button> }}</Toolbar>,
                            }}
                        </Dialog>
                    </>
                );
            },
            { name: 'LumxDialogWithHeaderFooterChildrenStory' },
        );

        return <WithHeaderFooterChildrenStory />;
    },
};

/**
 * Dialog needing a confirmation before close using a nested Dialog
 */
export const WithConfirmClose = {
    render: () => {
        const WithConfirmCloseStory = defineComponent(
            () => {
                const buttonRef = ref<HTMLElement>();
                const closeButtonRef = ref<HTMLElement>();
                const isOpen = ref(true);
                const isConfirmOpen = ref(false);

                const openConfirm = () => {
                    isConfirmOpen.value = true;
                };
                const closeConfirm = () => {
                    isConfirmOpen.value = false;
                };
                const closeAll = () => {
                    isOpen.value = false;
                    isConfirmOpen.value = false;
                };

                return () => (
                    <>
                        <Button
                            ref={buttonRef}
                            onClick={() => {
                                isOpen.value = true;
                            }}
                        >
                            Open dialog
                        </Button>
                        <Dialog
                            isOpen={isOpen.value}
                            onClose={openConfirm}
                            parentElement={(buttonRef.value as any)?.$el}
                        >
                            <FlexBox orientation="vertical" verticalAlign="center" class="lumx-spacing-padding-huge">
                                {loremIpsum('tiny')}
                                <Button ref={closeButtonRef} onClick={openConfirm}>
                                    Close
                                </Button>
                            </FlexBox>
                        </Dialog>
                        <Dialog
                            isOpen={isConfirmOpen.value}
                            onClose={closeConfirm}
                            parentElement={(closeButtonRef.value as any)?.$el}
                            size="tiny"
                        >
                            {{
                                header: () => <Toolbar>{{ default: () => 'Confirm close' }}</Toolbar>,
                                default: () => loremIpsum('tiny'),
                                footer: () => (
                                    <Toolbar>
                                        {{
                                            after: () => (
                                                <>
                                                    <Button emphasis="medium" onClick={closeConfirm}>
                                                        Cancel
                                                    </Button>
                                                    <Button class="lumx-spacing-margin-left-regular" onClick={closeAll}>
                                                        Confirm
                                                    </Button>
                                                </>
                                            ),
                                        }}
                                    </Toolbar>
                                ),
                            }}
                        </Dialog>
                    </>
                );
            },
            { name: 'DialogWithConfirmCloseStory' },
        );

        return <WithConfirmCloseStory />;
    },
};

/**
 * Test dialog focus trap (focus is contained inside the dialog) with all kinds of focusable and non-focusable items
 */
export const FocusTrap = {
    tags: ['!snapshot'],
    render: () => {
        const FocusTrapStory = defineComponent(
            () => {
                const buttonRef = ref<HTMLElement>();
                const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
                const inputRefCallback = (el: HTMLInputElement | HTMLTextAreaElement | null) => {
                    inputRef.value = el;
                };
                const isOpen = ref(true);
                const textValue = ref('value');
                const checkboxValue = ref(false);

                const nestedDialogButtonRef = ref<HTMLElement>();
                const isNestedOpen = ref(false);

                return () => (
                    <>
                        <Button
                            ref={buttonRef}
                            onClick={() => {
                                isOpen.value = true;
                            }}
                        >
                            Open dialog
                        </Button>
                        <Dialog
                            isOpen={isOpen.value}
                            onClose={() => {
                                isOpen.value = false;
                            }}
                            parentElement={(buttonRef.value as any)?.$el}
                            focusElement={inputRef.value ?? undefined}
                        >
                            {{
                                header: () => (
                                    <Toolbar>
                                        {{
                                            default: () => <span class="lumx-typography-title">Dialog header</span>,
                                            after: () => (
                                                <IconButton
                                                    label="Close"
                                                    icon={mdiClose}
                                                    emphasis="low"
                                                    onClick={() => {
                                                        isOpen.value = false;
                                                    }}
                                                />
                                            ),
                                        }}
                                    </Toolbar>
                                ),
                                default: () => (
                                    <div class="lumx-spacing-padding-horizontal-huge lumx-spacing-padding-bottom-huge">
                                        <div class="lumx-spacing-margin-bottom-huge">
                                            The text field should capture the focus on open and a focus trap should be
                                            in place.
                                        </div>

                                        <TextField
                                            class="lumx-spacing-margin-bottom-huge"
                                            inputRef={inputRefCallback}
                                            value={textValue.value}
                                            label="Text input"
                                            maxLength={10}
                                            onChange={(v: string) => {
                                                textValue.value = v;
                                            }}
                                        />

                                        <Checkbox
                                            class="lumx-spacing-margin-bottom-huge"
                                            isChecked={checkboxValue.value}
                                            label="Checkbox input"
                                            onChange={(v: boolean) => {
                                                checkboxValue.value = v;
                                            }}
                                        />

                                        <FlexBox orientation="horizontal" horizontalAlign="bottom" gap="regular">
                                            <Button
                                                ref={nestedDialogButtonRef}
                                                onClick={() => {
                                                    isNestedOpen.value = true;
                                                }}
                                            >
                                                Open nested dialog
                                            </Button>
                                            <Dialog
                                                isOpen={isNestedOpen.value}
                                                parentElement={(nestedDialogButtonRef.value as any)?.$el}
                                                onClose={() => {
                                                    isNestedOpen.value = false;
                                                }}
                                            >
                                                {{
                                                    header: () => (
                                                        <Toolbar>
                                                            {{
                                                                default: () => (
                                                                    <span class="lumx-typography-title">
                                                                        Nested dialog
                                                                    </span>
                                                                ),
                                                                after: () => (
                                                                    <IconButton
                                                                        label="Close"
                                                                        icon={mdiClose}
                                                                        emphasis="low"
                                                                        onClick={() => {
                                                                            isNestedOpen.value = false;
                                                                        }}
                                                                    />
                                                                ),
                                                            }}
                                                        </Toolbar>
                                                    ),
                                                    default: () => (
                                                        <div class="lumx-spacing-padding">{loremIpsum('short')}</div>
                                                    ),
                                                }}
                                            </Dialog>

                                            <Button isDisabled>Disabled button (focus ignored)</Button>
                                        </FlexBox>

                                        <div tabindex={0}>Focus div</div>

                                        <Button isDisabled={false}>
                                            Button explicitly not disabled (should focus)
                                        </Button>
                                    </div>
                                ),
                            }}
                        </Dialog>
                    </>
                );
            },
            { name: 'LumxDialogFocusTrapStory' },
        );

        return <FocusTrapStory />;
    },
};
