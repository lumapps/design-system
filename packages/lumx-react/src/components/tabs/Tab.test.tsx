import React, { createRef, forwardRef } from 'react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import BaseTabTests from '@lumx/core/js/components/Tabs/Tests';
import { vi } from 'vitest';

import { Tab, TabProps } from './Tab';
import { TabList } from './TabList';
import { TabProvider } from './TabProvider';

const CLASSNAME = Tab.className as string;

const setup = (propsOverride: Partial<TabProps> = {}) => {
    const props = { label: 'Label', ...propsOverride };
    render(<Tab {...props} />);
    const tab = getByClassName(document.body, CLASSNAME);
    return { props, tab };
};

describe(`<${Tab.displayName}>`, () => {
    BaseTabTests({
        render: (props: TabProps) => render(<Tab {...props} />),
        screen,
    });

    describe('nav-link mode', () => {
        it('should render as an anchor with plain link semantics (no tab role/aria)', () => {
            render(<Tab as="a" href="/page" label="Home" />);

            const link = screen.getByRole('link', { name: 'Home' });
            expect(link.tagName).toBe('A');
            expect(link).toHaveClass(CLASSNAME);
            expect(link).toHaveAttribute('href', '/page');
            expect(link).not.toHaveAttribute('role');
            expect(link).not.toHaveAttribute('aria-selected');
            expect(link).not.toHaveAttribute('aria-controls');
            expect(screen.queryByRole('tab')).not.toBeInTheDocument();
        });

        it('should set aria-current="page" only when active', () => {
            const { rerender } = render(<Tab as="a" href="#" label="Home" />);
            expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');

            rerender(<Tab as="a" href="#" label="Home" isActive />);
            expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
        });

        it('should preserve the caller onClick when enabled', async () => {
            const onClick = vi.fn();
            render(<Tab as="a" href="#" label="Home" onClick={onClick} />);

            await userEvent.click(screen.getByRole('link', { name: 'Home' }));
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('should block interaction when disabled', async () => {
            const onClick = vi.fn();
            render(<Tab as="a" href="#" label="Home" isDisabled onClick={onClick} />);

            const link = screen.getByRole('link', { name: 'Home' });
            expect(link).toHaveAttribute('aria-disabled', 'true');
            expect(link).toHaveAttribute('tabindex', '-1');

            await userEvent.click(link);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should preserve aria-current set by a custom `as` component managing it internally (e.g. router NavLink)', () => {
            // Simulates a router `NavLink`: ignores whatever `aria-current` it receives and decides
            // its own value internally (e.g. based on route matching), like react-router's NavLink.
            const FakeNavLink = forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'>>(
                ({ 'aria-current': _ignoredAriaCurrent, children, ...props }, r) => (
                    <a ref={r} {...props} aria-current="page">
                        {children}
                    </a>
                ),
            );
            FakeNavLink.displayName = 'FakeNavLink';

            render(<Tab as={FakeNavLink} href="/home" label="Home" />);

            const link = screen.getByRole('link', { name: 'Home' });
            expect(link).toHaveAttribute('aria-current', 'page');
        });

        it('should render a custom component and forward the ref (ref type follows `as`)', () => {
            const ref = createRef<HTMLAnchorElement>();
            const RouterLink = forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'>>(
                ({ children, ...props }, r) => (
                    <a ref={r} {...props}>
                        {children}
                    </a>
                ),
            );
            RouterLink.displayName = 'RouterLink';

            render(<Tab as={RouterLink} href="#" label="Home" ref={ref} />);
            expect(ref.current).toBe(screen.getByRole('link', { name: 'Home' }));
        });
    });

    describe('mode gating (provider presence)', () => {
        it('renders role="tab" inside a TabProvider (cell 1: provider + button)', () => {
            render(
                <TabProvider>
                    <TabList aria-label="Tabs">
                        <Tab label="Tab 1" />
                    </TabList>
                </TabProvider>,
            );

            expect(screen.getByRole('tablist', { name: 'Tabs' })).toBeInTheDocument();
            const tab = screen.getByRole('tab', { name: 'Tab 1' });
            expect(tab.tagName).toBe('BUTTON');
            expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
        });

        it('honors `as` in tab mode: role="tab" on an anchor inside a provider (cell 2: provider + as="a")', () => {
            render(
                <TabProvider>
                    <TabList aria-label="Tabs">
                        <Tab as="a" href="/home" label="Home" />
                    </TabList>
                </TabProvider>,
            );

            const tab = screen.getByRole('tab', { name: 'Home' });
            expect(tab.tagName).toBe('A');
            expect(tab).toHaveAttribute('href', '/home');
            // The explicit `tab` role wins over the anchor's implicit `link` role.
            expect(screen.queryByRole('link')).not.toBeInTheDocument();
        });

        it('drops tab semantics without a provider: navigation landmark + plain buttons (cell 3: no provider + button)', () => {
            render(
                <TabList aria-label="Site nav">
                    <Tab label="Home" isActive />
                    <Tab label="About" />
                </TabList>,
            );

            expect(screen.getByRole('navigation', { name: 'Site nav' })).toBeInTheDocument();
            expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
            expect(screen.queryByRole('tab')).not.toBeInTheDocument();

            const home = screen.getByRole('button', { name: 'Home' });
            expect(home).not.toHaveAttribute('role', 'tab');
            expect(home).not.toHaveAttribute('aria-selected');
            expect(home).toHaveAttribute('aria-current', 'page');
            expect(screen.getByRole('button', { name: 'About' })).not.toHaveAttribute('aria-current');
        });
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tab',
        forwardAttributes: 'tab',
        forwardRef: 'tab',
    });
});
