import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Size } from '@lumx/react';
import React from 'react';
import { DisabledStateProvider } from '@lumx/react/utils/disabled';
import { ListItem, ListItemProps } from './ListItem';

const CLASSNAME = ListItem.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ListItemProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<ListItem {...(props as any)} />, { wrapper });
    const listItem = getByClassName(document.body, CLASSNAME);
    const link = queryByClassName(listItem, `${CLASSNAME}__link`);
    const listItemWrapper = queryByClassName(listItem, `${CLASSNAME}__wrapper`);
    return { props, listItem, link, wrapper: listItemWrapper };
};

describe(`<${ListItem.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { listItem, link, wrapper: listItemWrapper } = setup({ children: 'Label' });
            expect(listItem).toBeInTheDocument();
            expect(link).not.toBeInTheDocument();
            expect(listItemWrapper).toBeInTheDocument();
            expect(listItemWrapper?.tagName).toBe('DIV');
            expect(listItem).toHaveTextContent('Label');
        });

        it('should render as a button', () => {
            const { link } = setup({ children: 'Label', onItemSelected: vi.fn() });
            expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
            expect(link?.tagName).toBe('BUTTON');
        });

        it('should render as a link', () => {
            const { link } = setup({ children: 'Label', linkProps: { href: '#' } });
            expect(screen.getByRole('link', { name: 'Label' })).toBeInTheDocument();
            expect(link?.tagName).toBe('A');
            expect(link).toHaveAttribute('href', '#');
        });

        it('should render before and after content', () => {
            const { listItem } = setup({
                children: 'Label',
                before: <span data-testid="before">Before</span>,
                after: <span data-testid="after">After</span>,
            });
            expect(screen.getByTestId('before')).toBeInTheDocument();
            expect(screen.getByTestId('after')).toBeInTheDocument();
            expect(listItem.querySelector(`.${CLASSNAME}__before`)).toBeInTheDocument();
            expect(listItem.querySelector(`.${CLASSNAME}__after`)).toBeInTheDocument();
        });

        it('should apply highlighted and selected classes to link', () => {
            const { link } = setup({
                children: 'Label',
                onItemSelected: vi.fn(),
                isHighlighted: true,
                isSelected: true,
            });
            expect(link).toHaveClass(`${CLASSNAME}__link--is-highlighted`);
            expect(link).toHaveClass(`${CLASSNAME}__link--is-selected`);
        });

        it('should apply size class', () => {
            const { listItem } = setup({ children: 'Label', size: Size.big });
            expect(listItem).toHaveClass(`${CLASSNAME}--size-big`);
        });

        it('should forward multiple refs (button mode)', () => {
            const listItemRef = React.createRef<HTMLLIElement>();
            const linkRef = React.createRef<HTMLButtonElement>();
            setup({
                children: 'Label',
                onItemSelected: vi.fn(),
                ref: listItemRef,
                linkRef: linkRef as any,
            });
            expect(listItemRef.current).toBeInstanceOf(HTMLLIElement);
            expect(linkRef.current).toBeInstanceOf(HTMLButtonElement);
        });

        it('should forward multiple refs (link mode)', () => {
            const listItemRef = React.createRef<HTMLLIElement>();
            const linkRef = React.createRef<HTMLAnchorElement>();
            setup({
                children: 'Label',
                linkProps: { href: '#' },
                ref: listItemRef,
                linkRef,
            });
            expect(listItemRef.current).toBeInstanceOf(HTMLLIElement);
            expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement);
        });
    });

    describe('Click handling', () => {
        it('should call onItemSelected when button is clicked', async () => {
            const onItemSelected = vi.fn();
            setup({ children: 'Label', onItemSelected });
            await userEvent.click(screen.getByRole('button', { name: 'Label' }));
            expect(onItemSelected).toHaveBeenCalledTimes(1);
        });

        it('should call onItemSelected when link is clicked', async () => {
            const onItemSelected = vi.fn();
            setup({ children: 'Label', linkProps: { href: '#' }, onItemSelected });
            await userEvent.click(screen.getByRole('link', { name: 'Label' }));
            expect(onItemSelected).toHaveBeenCalledTimes(1);
        });
    });

    describe('linkAs prop', () => {
        it('should render as a custom component when linkAs is provided with href', () => {
            const CustomLink = React.forwardRef(({ children, ...props }: any, ref: any) => (
                <a data-custom="true" ref={ref} {...props}>
                    {children}
                </a>
            ));
            const { link } = setup({
                children: 'Label',
                linkAs: CustomLink,
                linkProps: { href: '/custom' },
            });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('data-custom', 'true');
            expect(link).toHaveAttribute('href', '/custom');
        });

        it('should render as clickable when only linkAs is provided', () => {
            const CustomLink = React.forwardRef(({ children, ...props }: any, ref: any) => (
                <a data-custom="true" ref={ref} {...props}>
                    {children}
                </a>
            ));
            const { link } = setup({
                children: 'Label',
                linkAs: CustomLink,
            });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('data-custom', 'true');
        });
    });

    describe('linkProps forwarding', () => {
        it('should forward target and rel to the link', () => {
            const { link } = setup({
                children: 'Label',
                linkProps: { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer' },
            });
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });

    describe('Disabled state', () => {
        it('should render disabled list item button', async () => {
            const onItemSelected = vi.fn();
            const { link } = setup({ children: 'Label', isDisabled: true, onItemSelected });
            expect(link).toHaveAttribute('aria-disabled', 'true');
            if (link) await userEvent.click(link);
            expect(onItemSelected).not.toHaveBeenCalled();
        });

        it('should render disabled list item link', async () => {
            const onItemSelected = vi.fn();
            const { link } = setup({
                children: 'Label',
                isDisabled: true,
                linkProps: { href: 'https://example.com' },
                onItemSelected,
            });
            expect(link).toHaveAttribute('aria-disabled', 'true');
            if (link) await userEvent.click(link);
            expect(onItemSelected).not.toHaveBeenCalled();
        });

        it('should render aria-disabled list item button', async () => {
            const onItemSelected = vi.fn();
            const { link } = setup({ children: 'Label', 'aria-disabled': true, onItemSelected });
            expect(link).toHaveAttribute('aria-disabled', 'true');
            if (link) await userEvent.click(link);
            expect(onItemSelected).not.toHaveBeenCalled();
        });

        it('should render aria-disabled list item link', async () => {
            const onItemSelected = vi.fn();
            const { link } = setup({
                children: 'Label',
                'aria-disabled': true,
                linkProps: { href: 'https://example.com' },
                onItemSelected,
            });
            expect(link).toHaveAttribute('aria-disabled', 'true');
            if (link) await userEvent.click(link);
            expect(onItemSelected).not.toHaveBeenCalled();
        });

        it('should render disabled from DisabledStateProvider context (button)', async () => {
            const onItemSelected = vi.fn();
            const { link } = setup(
                { children: 'Label', onItemSelected },
                {
                    wrapper: ({ children }) => (
                        <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
                    ),
                },
            );
            expect(link).toHaveAttribute('aria-disabled', 'true');
            if (link) await userEvent.click(link);
            expect(onItemSelected).not.toHaveBeenCalled();
        });

        it('should render disabled from DisabledStateProvider context (link)', async () => {
            const onItemSelected = vi.fn();
            const { link } = setup(
                {
                    children: 'Label',
                    linkProps: { href: 'https://example.com' },
                    onItemSelected,
                },
                {
                    wrapper: ({ children }) => (
                        <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
                    ),
                },
            );
            expect(link).toHaveAttribute('aria-disabled', 'true');
            if (link) await userEvent.click(link);
            expect(onItemSelected).not.toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listItem',
        forwardAttributes: 'listItem',
    });
});
