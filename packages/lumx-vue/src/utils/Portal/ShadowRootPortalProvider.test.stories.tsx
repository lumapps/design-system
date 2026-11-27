/* eslint-disable vue/one-component-per-file */
import { defineComponent, onBeforeUnmount, onMounted, ref, shallowRef, Teleport } from 'vue';
import { expect, within, waitFor } from 'storybook/test';
import { initDemoShadowRoot } from '@lumx/core/stories/utils/initDemoShadowRoot';
import { PORTAL_CONTAINER_CLASSNAME } from '@lumx/core/js/utils/Portal';
import { CLASSNAME as DIALOG_CLASSNAME } from '@lumx/core/js/components/Dialog/constants';
import { Button, Dialog, Lightbox, MenuButton, MenuItem, SelectTextField, Tooltip } from '@lumx/vue';

import { ShadowRootPortalProvider } from './ShadowRootPortalProvider';

const SHADOW_HOST_SELECTOR = '[data-testid="shadow-root-host"]';

/**
 * Teleport its default slot into a demo shadow root, styled like the page.
 * Overrides the global `PortalProvider` of `withGlobalProviders` with a `ShadowRootPortalProvider`.
 */
const ShadowRootHost = defineComponent(
    (_props, { slots }) => {
        const shadowRoot = shallowRef<ShadowRoot>();
        let teardown: (() => void) | undefined;

        onMounted(() => {
            const demo = initDemoShadowRoot();
            demo.host.setAttribute('data-testid', 'shadow-root-host');
            teardown = demo.teardown;
            shadowRoot.value = demo.shadowRoot;
        });

        onBeforeUnmount(() => teardown?.());

        return () =>
            shadowRoot.value ? (
                <Teleport to={shadowRoot.value}>
                    <ShadowRootPortalProvider>{slots.default?.()}</ShadowRootPortalProvider>
                </Teleport>
            ) : null;
    },
    { name: 'ShadowRootHost' },
);

/** Wait for the demo shadow root built for the current story, then query inside it: `screen` does not see into a shadow root. */
const findShadowRoot = () =>
    waitFor(() => {
        const host = document.querySelector(SHADOW_HOST_SELECTOR) as HTMLElement | null;
        if (!host?.shadowRoot) throw new Error('Shadow root not found');
        return host.shadowRoot;
    });

/** Wait for the shared portal container inside a shadow root. */
const findPortalContainer = (shadowRoot: ShadowRoot) =>
    waitFor(() => {
        const el = shadowRoot.querySelector<HTMLElement>(`.${PORTAL_CONTAINER_CLASSNAME}`);
        if (!el) throw new Error('Portal container not found');
        return el;
    });

const DialogStory = defineComponent(
    () => {
        const buttonRef = ref<HTMLElement>();
        const isOpen = ref(false);

        return () => (
            <>
                <Button ref={buttonRef} onClick={() => (isOpen.value = true)}>
                    Open dialog
                </Button>
                <Dialog
                    isOpen={isOpen.value}
                    onClose={() => (isOpen.value = false)}
                    parentElement={(buttonRef.value as any)?.$el}
                >
                    Dialog content
                </Dialog>
            </>
        );
    },
    { name: 'DialogStory' },
);

const TooltipStory = defineComponent(
    () => () => (
        <Tooltip label="Tooltip label">
            <Button>Anchor</Button>
        </Tooltip>
    ),
    { name: 'TooltipStory' },
);

const LightboxStory = defineComponent(
    () => {
        const buttonRef = ref<HTMLElement>();
        const isOpen = ref(false);

        return () => (
            <>
                <Button ref={buttonRef} onClick={() => (isOpen.value = true)}>
                    Open lightbox
                </Button>
                <Lightbox
                    isOpen={isOpen.value}
                    onClose={() => (isOpen.value = false)}
                    parentElement={(buttonRef.value as any)?.$el}
                >
                    Lightbox content
                </Lightbox>
            </>
        );
    },
    { name: 'LightboxStory' },
);

const SelectTextFieldStory = defineComponent(
    () => {
        const value = ref<string>();
        const options = [
            { id: 'apple', name: 'Apple' },
            { id: 'banana', name: 'Banana' },
        ];

        return () => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                options={options}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value.value}
                onChange={(newValue: any) => (value.value = newValue)}
                translations={{ clearLabel: 'Clear', showSuggestionsLabel: 'Show suggestions' }}
            />
        );
    },
    { name: 'SelectTextFieldStory' },
);

const MenuButtonStory = defineComponent(
    () => () => (
        <MenuButton label="Open menu">
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
        </MenuButton>
    ),
    { name: 'MenuButtonStory' },
);

const OverlaysInsideDialogStory = defineComponent(
    () => {
        const dialogButtonRef = ref<HTMLElement>();
        const isDialogOpen = ref(false);

        return () => (
            <>
                <Button ref={dialogButtonRef} onClick={() => (isDialogOpen.value = true)}>
                    Open dialog
                </Button>
                <Dialog
                    isOpen={isDialogOpen.value}
                    onClose={() => (isDialogOpen.value = false)}
                    parentElement={(dialogButtonRef.value as any)?.$el}
                >
                    <MenuButton label="Open menu">
                        <MenuItem>Profile</MenuItem>
                    </MenuButton>
                    <Tooltip label="Tooltip label">
                        <Button>Anchor</Button>
                    </Tooltip>
                </Dialog>
            </>
        );
    },
    { name: 'OverlaysInsideDialogStory' },
);

export default {
    title: 'utils/portal/ShadowRootPortalProvider/Tests',
    parameters: { chromatic: { disable: true } },
    tags: ['!snapshot'],
};

export const TestDialogInShadowRoot = {
    render: () => () => (
        <ShadowRootHost>
            <DialogStory />
        </ShadowRootHost>
    ),
    async play() {
        const shadowRoot = await findShadowRoot();
        const canvas = within(shadowRoot as unknown as HTMLElement);
        await (await canvas.findByRole('button', { name: 'Open dialog' })).click();

        const container = await findPortalContainer(shadowRoot);

        await within(container).findByRole('dialog');
        const dialog = container.querySelector(`.${DIALOG_CLASSNAME}`) as HTMLElement;
        expect(dialog).toBeInTheDocument();
        expect(getComputedStyle(dialog).position).toBe('fixed');
    },
};

export const TestTooltipInShadowRoot = {
    render: () => () => (
        <ShadowRootHost>
            <TooltipStory />
        </ShadowRootHost>
    ),
    async play({ userEvent }: any) {
        const shadowRoot = await findShadowRoot();
        const canvas = within(shadowRoot as unknown as HTMLElement);
        const button = await canvas.findByRole('button', { name: 'Anchor' });
        await userEvent.hover(button);

        const container = await findPortalContainer(shadowRoot);

        await within(container).findByRole('tooltip', { name: 'Tooltip label' });
    },
};

export const TestLightboxInShadowRoot = {
    render: () => () => (
        <ShadowRootHost>
            <LightboxStory />
        </ShadowRootHost>
    ),
    async play() {
        const shadowRoot = await findShadowRoot();
        const canvas = within(shadowRoot as unknown as HTMLElement);
        await (await canvas.findByRole('button', { name: 'Open lightbox' })).click();

        const container = await findPortalContainer(shadowRoot);

        await within(container).findByText('Lightbox content');
    },
};

export const TestSelectTextFieldPopoverInShadowRoot = {
    render: () => () => (
        <ShadowRootHost>
            <SelectTextFieldStory />
        </ShadowRootHost>
    ),
    async play({ userEvent }: any) {
        const shadowRoot = await findShadowRoot();
        const canvas = within(shadowRoot as unknown as HTMLElement);
        const input = await canvas.findByRole('combobox');
        await userEvent.click(input);

        const container = await findPortalContainer(shadowRoot);

        await within(container).findByRole('option', { name: 'Apple' });
    },
};

export const TestMenuButtonPopoverInShadowRoot = {
    render: () => () => (
        <ShadowRootHost>
            <MenuButtonStory />
        </ShadowRootHost>
    ),
    async play({ userEvent }: any) {
        const shadowRoot = await findShadowRoot();
        const canvas = within(shadowRoot as unknown as HTMLElement);
        const trigger = await canvas.findByRole('button', { name: 'Open menu' });
        await userEvent.click(trigger);
        await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));

        // `MenuButton` renders its popover inline (`usePortal={false}`), so it stays in the shadow
        // root instead of moving to the shared portal container, unlike the other overlays.
        await canvas.findByRole('button', { name: 'Profile' });
    },
};

export const TestOverlaysInsideDialog = {
    render: () => () => (
        <ShadowRootHost>
            <OverlaysInsideDialogStory />
        </ShadowRootHost>
    ),
    async play({ userEvent }: any) {
        const shadowRoot = await findShadowRoot();
        const canvas = within(shadowRoot as unknown as HTMLElement);
        await (await canvas.findByRole('button', { name: 'Open dialog' })).click();

        const container = await findPortalContainer(shadowRoot);

        const dialog = await within(container).findByRole('dialog');

        // `MenuButton` renders its popover inline (`usePortal={false}`), so it opens as a descendant
        // of the dialog instead of moving to the shared container, unlike the tooltip below.
        const menuTrigger = await within(dialog).findByRole('button', { name: 'Open menu' });
        await userEvent.click(menuTrigger);
        await waitFor(() => expect(menuTrigger).toHaveAttribute('aria-expanded', 'true'));
        await within(dialog).findByRole('button', { name: 'Profile' });

        const tooltipAnchor = await within(dialog).findByRole('button', { name: 'Anchor' });
        await userEvent.hover(tooltipAnchor);
        const tooltip = await within(container).findByRole('tooltip', { name: 'Tooltip label' });

        const children = Array.from(container.children);
        const dialogIndex = children.indexOf(dialog.closest(`.${DIALOG_CLASSNAME}`) as Element);
        const tooltipIndex = children.findIndex((child) => child.contains(tooltip));
        expect(dialogIndex).toBeGreaterThanOrEqual(0);
        expect(tooltipIndex).toBeGreaterThan(dialogIndex);

        const dialogZIndex = Number(getComputedStyle(dialog.closest(`.${DIALOG_CLASSNAME}`) as Element).zIndex);
        const tooltipZIndex = Number(getComputedStyle(tooltip).zIndex);
        expect(tooltipZIndex).toBeGreaterThan(dialogZIndex);
    },
};
