import { fireEvent, render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';
import { vi } from 'vitest';
import { mdiPlay } from '@lumx/icons';
import BaseTabTests, { setup } from '@lumx/core/js/components/Tabs/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Tabs/Tab';
import { queryByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Tab } from '.';
import { INIT_STATE, TAB_PROVIDER_INJECT_KEY } from './state';

/**
 * Render options that inject a `TabProvider` context so `Tab` renders in tab mode (`role="tab"`),
 * while keeping `Tab` as the root component so `emitted()` still captures its events.
 */
const inProviderOptions = () => ({
    global: { provide: { [TAB_PROVIDER_INJECT_KEY]: { state: ref(INIT_STATE), dispatch: () => undefined } } },
});

describe('<Tab />', () => {
    const renderTab = (props: any, options?: SetupRenderOptions<any>) => render(Tab, { ...options, props });

    // Run core tests
    BaseTabTests({
        render: renderTab,
        screen,
    });

    const setupTab = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderTab, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupTab, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tab',
        forwardAttributes: 'tab',
        forwardRef: 'tab',
    });

    describe('Vue', () => {
        it('should emit focus event when the tab is focused', async () => {
            const { emitted } = render(Tab, { props: { label: 'Tab' }, ...inProviderOptions() });
            await fireEvent.focus(screen.getByRole('tab'));
            expect(emitted('focus')).toHaveLength(1);
        });

        it('should emit keypress event when a key is pressed on the tab', async () => {
            const { emitted } = render(Tab, { props: { label: 'Tab' }, ...inProviderOptions() });
            await fireEvent.keyPress(screen.getByRole('tab'));
            expect(emitted('keypress')).toHaveLength(1);
        });
    });

    describe('mode gating (provider presence)', () => {
        it('renders role="tab" in a provider (cell 1: provider + button)', () => {
            render(Tab, { props: { label: 'Tab 1' }, ...inProviderOptions() });

            const tab = screen.getByRole('tab', { name: 'Tab 1' });
            expect(tab.tagName).toBe('BUTTON');
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        it('honors the action slot in tab mode: role="tab" on an anchor (cell 2: provider + action slot)', () => {
            render(Tab, {
                props: { label: 'Home' },
                slots: { action: () => h('a', { href: '/home' }) },
                ...inProviderOptions(),
            });

            const tab = screen.getByRole('tab', { name: 'Home' });
            expect(tab.tagName).toBe('A');
            expect(tab).toHaveAttribute('href', '/home');
            // The explicit `tab` role wins over the anchor's implicit `link` role.
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        it('drops tab semantics without a provider (cell 3: no provider + button)', () => {
            render(Tab, { props: { label: 'Home', isActive: true } });

            expect(screen.queryByRole('tab')).not.toBeInTheDocument();
            const button = screen.getByRole('button', { name: 'Home' });
            expect(button).not.toHaveAttribute('role', 'tab');
            expect(button).not.toHaveAttribute('aria-selected');
            expect(button).toHaveAttribute('aria-current', 'page');
        });
    });

    describe('nav-link mode (action slot)', () => {
        it('should render the action element as a link with core semantics and inner icon+label', () => {
            render(Tab, {
                props: { label: 'Home', icon: mdiPlay },
                slots: {
                    action: () => h('a', { href: '/home' }),
                },
            });

            const link = screen.getByRole('link', { name: 'Home' });
            expect(link.tagName).toBe('A');
            expect(link).toHaveClass(CLASSNAME);
            expect(link).toHaveAttribute('href', '/home');
            // No classic tab semantics.
            expect(screen.queryByRole('tab')).not.toBeInTheDocument();
            expect(link).not.toHaveAttribute('role', 'tab');
            // Icon + label rendered inside the link by core.
            expect(queryByClassName(link, 'lumx-icon')).toBeInTheDocument();
        });

        it('should set aria-current="page" only when isActive', () => {
            const { unmount } = render(Tab, {
                props: { label: 'Home', isActive: true },
                slots: { action: () => h('a', { href: '/home' }) },
            });
            expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
            unmount();

            render(Tab, {
                props: { label: 'Home' },
                slots: { action: () => h('a', { href: '/home' }) },
            });
            expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
        });

        it('should render disabled nav-link with aria-disabled, tabindex -1 and block click', async () => {
            const onClick = vi.fn();
            render(Tab, {
                props: { label: 'Home', isDisabled: true },
                slots: { action: () => h('a', { href: '/home', onClick }) },
            });

            const link = screen.getByRole('link', { name: 'Home' });
            expect(link).toHaveAttribute('aria-disabled', 'true');
            expect(link).toHaveAttribute('tabindex', '-1');

            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should preserve the caller onClick when not disabled', async () => {
            const onClick = vi.fn();
            render(Tab, {
                props: { label: 'Home' },
                slots: { action: () => h('a', { href: '/home', onClick }) },
            });

            await userEvent.click(screen.getByRole('link', { name: 'Home' }));
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('should preserve aria-current set by a custom link component managing it internally (e.g. router NavLink)', () => {
            // Simulates a router `NavLink`: ignores whatever `aria-current` it receives via attrs
            // and decides its own value internally (e.g. based on route matching).
            const FakeNavLink = defineComponent({
                inheritAttrs: false,
                props: { to: { type: String, required: true } },
                setup(componentProps, { attrs, slots }) {
                    return () => {
                        const { 'aria-current': _ignoredAriaCurrent, ...rest } = attrs;
                        return h('a', { href: componentProps.to, ...rest, 'aria-current': 'page' }, slots.default?.());
                    };
                },
            });

            render(Tab, {
                props: { label: 'Home' },
                slots: { action: () => h(FakeNavLink, { to: '/home' }) },
            });

            const link = screen.getByRole('link', { name: 'Home' });
            expect(link).toHaveAttribute('aria-current', 'page');
        });

        it('should merge a custom class on the action slot element with the core classes', () => {
            render(Tab, {
                props: { label: 'Home' },
                slots: { action: () => h('a', { href: '/home', class: 'custom-link-class' }) },
            });

            const link = screen.getByRole('link', { name: 'Home' });
            expect(link).toHaveClass('custom-link-class');
            expect(link).toHaveClass(CLASSNAME);
        });

        it('should render as a custom link component (e.g. RouterLink)', () => {
            const RouterLink = defineComponent({
                inheritAttrs: false,
                props: { to: { type: String, required: true } },
                setup(componentProps, { attrs, slots }) {
                    return () => h('a', { href: componentProps.to, ...attrs }, slots.default?.());
                },
            });

            render(Tab, {
                props: { label: 'Home' },
                slots: { action: () => h(RouterLink, { to: '/home' }) },
            });

            const link = screen.getByRole('link', { name: 'Home' });
            expect(link.tagName).toBe('A');
            expect(link).toHaveClass(CLASSNAME);
            expect(link).toHaveAttribute('href', '/home');
            expect(screen.queryByRole('tab')).not.toBeInTheDocument();
        });
    });
});
