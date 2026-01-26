import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Size } from '@lumx/react';
import React from 'react';
import { ListItem, ListItemProps } from './ListItem';

const CLASSNAME = ListItem.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ListItemProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<ListItem {...(props as any)} />, { wrapper });
    const listItem = getByClassName(document.body, CLASSNAME);
    const link = queryByClassName(listItem, `${CLASSNAME}__link`);
    return { props, listItem, link };
};

describe(`<${ListItem.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { listItem, link } = setup({ children: 'Label' });
            expect(listItem).toBeInTheDocument();
            expect(link).not.toBeInTheDocument();
            expect(listItem).toHaveTextContent('Label');
        });

        it('should render as a button', () => {
            setup({ children: 'Label', onItemSelected: vi.fn() });
            expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
        });

        it('should render as a link', () => {
            setup({ children: 'Label', linkProps: { href: '#' } });
            expect(screen.getByRole('link', { name: 'Label' })).toBeInTheDocument();
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

        it('should forward multiple refs', () => {
            const listItemRef = React.createRef<HTMLLIElement>();
            const linkRef = React.createRef<HTMLAnchorElement>();
            setup({
                children: 'Label',
                onItemSelected: vi.fn(),
                ref: listItemRef,
                linkRef,
            });
            expect(listItemRef.current).toBeInstanceOf(HTMLLIElement);
            expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement);
        });
    });

    describe('Disabled state', () => {
        it('should render disabled list item button', async () => {
            const onItemSelected = vi.fn();
            const { link } = setup({ children: 'Label', isDisabled: true, onItemSelected });
            expect(link).toHaveAttribute('aria-disabled', 'true');
            // The `renderLink` util removes the onClick handler but `user-event` will also not fire events on disabled elements.
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
            expect(link).not.toHaveAttribute('href');
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
            expect(link).not.toHaveAttribute('href');
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
