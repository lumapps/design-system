/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { mdiClose, mdiMenuDown } from '@lumx/icons';
import { Heading, HeadingLevelProvider, IconButton, Button } from '@lumx/vue';
import { expect, screen, within } from 'storybook/test';

import { PopoverDialog } from '.';

const IconButtonTrigger = defineComponent(
    (_props: any, { attrs, slots }: any) => {
        const anchorRef = ref<HTMLElement>();
        const isOpen = ref(false);

        const open = () => {
            isOpen.value = true;
        };
        const close = () => {
            isOpen.value = false;
        };

        return () => (
            <>
                <IconButton label="Open popover" ref={anchorRef} onClick={open} icon={mdiMenuDown} />
                <PopoverDialog
                    anchorRef={anchorRef}
                    isOpen={isOpen.value}
                    onClose={close}
                    placement="bottom"
                    class="lumx-spacing-padding-huge"
                    {...attrs}
                >
                    <IconButton emphasis="low" onClick={close} icon={mdiClose} label="Close" />
                    <Button emphasis="medium">Other button</Button>
                    {slots.default?.()}
                </PopoverDialog>
            </>
        );
    },
    { name: 'IconButtonTrigger', inheritAttrs: false },
);

export default {
    title: 'LumX components/popover-dialog/PopoverDialog/Tests',
    component: PopoverDialog,
    tags: ['!snapshot'],
    parameters: { chromatic: { disable: true } },
    render: (args: any) => () => <IconButtonTrigger {...args} />,
};

/** Test: popover dialog opens and focuses the first button */
export const TestOpenAndInitFocus = {
    args: { label: 'Test Label' },
    async play({ userEvent }: any) {
        const trigger = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(trigger);

        const dialog = await screen.findByRole('dialog', { name: 'Test Label' });
        expect(within(dialog).getAllByRole('button')[0]).toHaveFocus();
    },
};

/** Test: popover dialog works with aria-label */
export const TestAriaLabel = {
    args: { 'aria-label': 'Custom Label' },
    async play({ userEvent }: any) {
        await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
        expect(await screen.findByRole('dialog', { name: 'Custom Label' })).toBeInTheDocument();
    },
};

/** Test: focus is trapped within the popover dialog */
export const TestTrapFocus = {
    args: { label: 'Test Label' },
    async play({ userEvent }: any) {
        await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
        const dialog = await screen.findByRole('dialog', { name: 'Test Label' });
        const dialogButtons = within(dialog).getAllByRole('button');

        // First button should have focus
        expect(dialogButtons[0]).toHaveFocus();

        // Tab to next button
        await userEvent.tab();
        expect(dialogButtons[1]).toHaveFocus();

        // Tab again: focus should loop back to first button
        await userEvent.tab();
        expect(dialogButtons[0]).toHaveFocus();
    },
};

/** Test: escape closes the dialog and restores focus to trigger */
export const TestCloseOnEscape = {
    args: { label: 'Test Label' },
    async play({ userEvent }: any) {
        const trigger = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(trigger);

        const dialog = await screen.findByRole('dialog', { name: 'Test Label' });

        await userEvent.keyboard('{Escape}');
        expect(dialog).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    },
};

/** Test: closing via the Close button restores focus to trigger */
export const TestCloseExternally = {
    args: { label: 'Test Label' },
    async play({ userEvent }: any) {
        const trigger = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(trigger);

        await screen.findByRole('dialog', { name: 'Test Label' });

        await userEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    },
};

/** Test: escape closes dialog with icon button trigger and restores focus */
export const TestCloseEscapeWithTooltip = {
    args: { label: 'Test Label' },
    async play({ userEvent }: any) {
        const trigger = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(trigger);

        const dialog = await screen.findByRole('dialog', { name: 'Test Label' });

        await userEvent.keyboard('{Escape}');
        expect(dialog).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    },
};

/** Test: heading level context is reset inside the popover dialog */
export const TestHeadingLevelReset = {
    render({ children, ...args }: any) {
        return () => (
            <HeadingLevelProvider level={3}>
                <IconButtonTrigger {...args}>{children}</IconButtonTrigger>
            </HeadingLevelProvider>
        );
    },
    args: {
        children: <Heading>Title</Heading>,
    },
    async play({ userEvent }: any) {
        await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
        // Heading inside the popover dialog should use level 2 (reset from context level 3)
        expect(screen.getByRole('heading', { name: 'Title', level: 2 })).toBeInTheDocument();
    },
};
