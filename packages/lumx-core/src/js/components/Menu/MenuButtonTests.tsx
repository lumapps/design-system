/* eslint-disable no-await-in-loop */
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/dom';

import { mdiAccount } from '@lumx/icons';

import { getByClassName } from '../../../testing/queries';
import { CLASSNAME as MENU_TRIGGER_CLASSNAME } from './MenuTrigger';

// ─── Types ───────────────────────────────────────────────────────

type RenderResult = { unmount: () => void; container: Element };

/**
 * Options to set up the MenuButton test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface MenuButtonTestSetup {
    components: {
        MenuButton: any;
        MenuItem: any;
    };
    /**
     * Render a MenuButton template, forwarding optional framework-specific render options
     * (e.g. `{ wrapper }` in React, `{ global }` in Vue).
     *
     * @param template JSX render function returning the element to render.
     * @param options  Framework-specific render options (e.g. wrapper component).
     */
    render: (template: () => any, options?: Record<string, any>) => RenderResult;
}

// ═══════════════════════════════════════════════════════════════════
// Main test suite
// ═══════════════════════════════════════════════════════════════════

export default function menuButtonTests({ components, render }: MenuButtonTestSetup) {
    const { MenuButton, MenuItem } = components;

    /**
     * Renders MenuButton with a single MenuItem child (labelled "First").
     * Returns props, container, the trigger element (for behavioral tests) and the
     * trigger wrapper element by class name (for `commonTestsSuite*`).
     */
    const setup = (propsOverride: Record<string, any> = {}, options?: Record<string, any>) => {
        const props = { label: 'Open menu', ...propsOverride };
        const { container } = render(
            () => (
                <MenuButton {...props}>
                    <MenuItem>First</MenuItem>
                </MenuButton>
            ),
            options,
        );
        const element = getByClassName(document.body, MENU_TRIGGER_CLASSNAME);
        const trigger = screen.queryByRole('button', { name: props.label }) as HTMLElement;
        return { props, container, element, trigger };
    };

    // ─── Render ──────────────────────────────────────────────────

    describe('render', () => {
        it('renders trigger with correct text content', () => {
            const { trigger } = setup();
            expect(trigger).toBeInTheDocument();
            expect(trigger).toHaveTextContent('Open menu');
        });

        it('sets ARIA attributes on the trigger', () => {
            const { trigger } = setup();
            expect(trigger).toHaveAttribute('aria-haspopup', 'true');
            expect(trigger).toHaveAttribute('aria-controls');
            expect(trigger).toHaveAttribute('aria-expanded', 'false');

            // aria-controls must reference the menu list element's id
            const ariaControls = trigger.getAttribute('aria-controls');
            expect(ariaControls).toBeTruthy();
            const menuList = document.getElementById(ariaControls!);
            expect(menuList).not.toBeNull();
            expect(menuList).toHaveAttribute('id', ariaControls);
        });
    });

    // ─── Open / close behavior ───────────────────────────────────

    describe('open & close', () => {
        it('opens menu on click', async () => {
            const { trigger } = setup();
            await userEvent.click(trigger);
            await screen.findByRole('button', { name: 'First' });
            await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
        });

        it('closes on second click', async () => {
            const { trigger } = setup();
            await userEvent.click(trigger);
            await screen.findByRole('button', { name: 'First' });
            await userEvent.click(trigger);
            await waitFor(() => expect(screen.queryByRole('button', { name: 'First' })).not.toBeInTheDocument());
        });

        it('closes when item is clicked', async () => {
            const { trigger } = setup();
            await userEvent.click(trigger);
            const first = await screen.findByRole('button', { name: 'First' });
            await userEvent.click(first);
            await waitFor(() => expect(screen.queryByRole('button', { name: 'First' })).not.toBeInTheDocument());
        });

        it('keeps menu open if onClick calls preventDefault', async () => {
            const onClick = vi.fn((e: any) => e.preventDefault());
            render(() => (
                <MenuButton label="Open menu">
                    <MenuItem onClick={onClick}>First</MenuItem>
                </MenuButton>
            ));
            await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
            const first = await screen.findByRole('button', { name: 'First' });
            await userEvent.click(first);
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
        });
    });

    // ─── onOpen callback ─────────────────────────────────────────

    describe('onOpen', () => {
        it('fires onOpen with true when menu opens and false when it closes', async () => {
            const onOpen = vi.fn();
            const { trigger } = setup({ onOpen });
            await userEvent.click(trigger);
            expect(onOpen).toHaveBeenCalledWith(true);
            await userEvent.click(trigger);
            expect(onOpen).toHaveBeenCalledWith(false);
        });
    });

    // ─── Disabled items ──────────────────────────────────────────

    describe('disabled items', () => {
        it('renders disabled items with aria-disabled', async () => {
            render(() => (
                <MenuButton label="Open menu">
                    <MenuItem isDisabled>Disabled</MenuItem>
                    <MenuItem>Active</MenuItem>
                </MenuButton>
            ));
            await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
            const disabled = await screen.findByRole('button', { name: 'Disabled' });
            expect(disabled).toHaveAttribute('aria-disabled', 'true');
        });
    });

    // ─── Variant-specific trigger ────────────────────────────────

    describe('variant trigger', () => {
        describe('variant="icon-button"', () => {
            const setupIconButton = (overrides?: Record<string, any>) =>
                setup({ variant: 'icon-button', label: 'More', ...overrides });

            it('renders an icon button with default mdiDotsVertical icon', () => {
                const { element } = setupIconButton();
                expect(element.querySelector('svg')).toBeTruthy();
            });

            it('renders a custom icon if provided', () => {
                const { element } = setupIconButton({ icon: mdiAccount });
                expect(element.querySelector('svg')).toBeTruthy();
            });

            it('sets disclosure aria attributes', () => {
                const { element } = setupIconButton();
                expect(element).toHaveAttribute('aria-haspopup', 'true');
                expect(element).toHaveAttribute('aria-controls');
                expect(element).toHaveAttribute('aria-expanded', 'false');

                const ariaControls = element.getAttribute('aria-controls');
                expect(ariaControls).toBeTruthy();
                expect(document.getElementById(ariaControls!)).not.toBeNull();
            });

            it('toggles aria-expanded and opens menu on click', async () => {
                const { element } = setupIconButton();
                expect(element).toHaveAttribute('aria-expanded', 'false');
                await userEvent.click(element);
                await screen.findByRole('button', { name: 'First' });
                expect(element).toHaveAttribute('aria-expanded', 'true');
            });
        });

        describe('variant="chip"', () => {
            const setupChip = () => setup({ variant: 'chip', label: 'Filters' });

            it('renders a chip', () => {
                const { element } = setupChip();
                expect(element).toBeInTheDocument();
                expect(element.tagName).toBe('A');
            });

            it('sets isClickable automatically', () => {
                const { element } = setupChip();
                expect(element.classList.contains('lumx-chip--is-clickable')).toBe(true);
            });

            it('sets disclosure aria attributes', () => {
                const { element } = setupChip();
                expect(element).toHaveAttribute('aria-haspopup', 'true');
                expect(element).toHaveAttribute('aria-controls');
                expect(element).toHaveAttribute('aria-expanded', 'false');

                const ariaControls = element.getAttribute('aria-controls');
                expect(ariaControls).toBeTruthy();
                expect(document.getElementById(ariaControls!)).not.toBeNull();
            });

            it('opens menu on click', async () => {
                const { element } = setupChip();
                await userEvent.click(element);
                await screen.findByRole('button', { name: 'First' });
                expect(element).toHaveAttribute('aria-expanded', 'true');
            });
        });
    });

    return { setup, triggerClassName: MENU_TRIGGER_CLASSNAME };
}
