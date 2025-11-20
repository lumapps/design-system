import React from 'react';

import { getAllByClassName, queryAllByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { SideNavigationItem, SideNavigationItemProps } from './SideNavigationItem';

const CLASSNAME = SideNavigationItem.className as string;

const toggleButtonProps = { label: 'Toggle' };

vi.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<SideNavigationItemProps> = {}) => {
    const props = { label: 'Label', toggleButtonProps, ...propsOverride };
    render(<SideNavigationItem {...props} />);
    const sideNavigation = getAllByClassName(document.body, CLASSNAME)[0];
    return {
        chevron: queryAllByClassName(sideNavigation, `${CLASSNAME}__chevron`)[0] || null,
        toggle: queryAllByClassName(sideNavigation, `${CLASSNAME}__toggle`)[0] || null,
        children: queryAllByClassName(sideNavigation, `${CLASSNAME}__children`)[0] || null,
        icon: queryAllByClassName(sideNavigation, `${CLASSNAME}__icon`)[0],
        label: queryAllByClassName(sideNavigation, `${CLASSNAME}__link span`)[0],
        link: queryAllByClassName(sideNavigation, `${CLASSNAME}__link`)[0],
        props,
        sideNavigation,
    };
};

describe(`<${SideNavigationItem.displayName}>`, () => {
    it('should render default', () => {
        const label = 'Side navigation item';
        const { sideNavigation, link } = setup({ label });
        expect(sideNavigation).toBeInTheDocument();
        expect(sideNavigation).toBe(screen.queryByRole('listitem'));

        expect(link).toBeInTheDocument();
        expect(link).toBe(screen.queryByRole('button', { name: label }));
        expect(link).not.toHaveAttribute('aria-expanded');
    });

    it('should render a link', () => {
        const label = 'Side navigation item';
        const { props, link } = setup({ linkProps: { href: 'https://example.com' }, label });
        expect(link).toBe(screen.queryByRole('link', { name: label }));
        expect(link).toHaveAttribute('href', props.linkProps?.href);
        expect(link).not.toHaveAttribute('aria-expanded');
    });

    describe('children', () => {
        it('should render with children closed unmount', () => {
            const label = 'Side navigation item';
            const { chevron, link, children } = setup({
                label,
                children: [
                    <SideNavigationItem key="1" label="Child 1" toggleButtonProps={toggleButtonProps} />,
                    <SideNavigationItem key="3" label="Child 2" toggleButtonProps={toggleButtonProps} />,
                ],
            });
            expect(link).toHaveTextContent(label);
            expect(link).toHaveAttribute('aria-expanded', 'false');
            expect(link).not.toHaveAttribute('aria-controls');
            expect(chevron).toBeInTheDocument();
            expect(children).not.toBeInTheDocument();
        });

        it('should render with children closed hidden', () => {
            const label = 'Side navigation item';
            const { chevron, link, children } = setup({
                label,
                closeMode: 'hide',
                children: [
                    <SideNavigationItem key="1" label="Child 1" toggleButtonProps={toggleButtonProps} />,
                    <SideNavigationItem key="3" label="Child 2" toggleButtonProps={toggleButtonProps} />,
                ],
            });
            expect(link).toHaveTextContent(label);
            expect(link).toHaveAttribute('aria-expanded', 'false');
            expect(link).toHaveAttribute('aria-controls', children?.id);
            expect(chevron).toBeInTheDocument();
            // Children are in DOM but hidden in CSS (can't test that here)
            expect(children).toBeInTheDocument();
        });

        it('should render with children opened', () => {
            const label = 'Side navigation item';
            const { chevron, link, children } = setup({
                label,
                isOpen: true,
                children: [
                    <SideNavigationItem key="1" label="Child 1" toggleButtonProps={toggleButtonProps} />,
                    <SideNavigationItem key="3" label="Child 2" toggleButtonProps={toggleButtonProps} />,
                ],
            });
            expect(link).toHaveTextContent(label);
            expect(link).toHaveAttribute('aria-expanded', 'true');
            expect(link).toHaveAttribute('aria-controls', children?.id);
            expect(chevron).toBeInTheDocument();
            expect(children).toBeInTheDocument();
        });
    });

    describe('children and link', () => {
        it('should render with children and link', () => {
            const onActionClick = vi.fn();
            const label = 'Side navigation item';
            const { props, toggle, link } = setup({
                label,
                linkProps: { href: 'https://example.com' },
                onActionClick,
                children: [
                    <SideNavigationItem key="1" label="Child 1" toggleButtonProps={toggleButtonProps} />,
                    <SideNavigationItem key="3" label="Child 2" toggleButtonProps={toggleButtonProps} />,
                ],
            });
            // Link
            expect(link).toBe(screen.queryByRole('link', { name: label }));
            expect(link).toHaveAttribute('href', props.linkProps?.href);

            // Toggle button
            expect(toggle).toBe(screen.queryByRole('button', { name: toggleButtonProps.label }));
            expect(toggle).toHaveAttribute('aria-expanded', 'false');
            expect(toggle).not.toHaveAttribute('aria-controls');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'sideNavigation',
        forwardAttributes: 'sideNavigation',
        forwardRef: 'sideNavigation',
    });
});
