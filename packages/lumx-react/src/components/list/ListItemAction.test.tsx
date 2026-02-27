import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BaseListItemActionTests from '@lumx/core/js/components/List/ListItemActionTests';

import { ListItemAction } from './ListItemAction';

describe(`<${ListItemAction.displayName}>`, () => {
    // Run core tests
    BaseListItemActionTests({
        render: ({ handleClick, ...props }: any) => render(<ListItemAction {...props} onClick={handleClick} />),
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should render as a custom component', () => {
            const CustomLink = React.forwardRef(({ children, ...props }: any, ref: any) => (
                <a data-custom="true" ref={ref} {...props}>
                    {children}
                </a>
            ));
            render(
                <ListItemAction as={CustomLink} href="/custom">
                    Custom link
                </ListItemAction>,
            );
            const link = screen.getByRole('link', { name: 'Custom link' });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('data-custom', 'true');
            expect(link).toHaveAttribute('href', '/custom');
        });

        it('should call onClick when clicked', async () => {
            const onClick = vi.fn();
            render(<ListItemAction onClick={onClick}>Label</ListItemAction>);
            await userEvent.click(screen.getByRole('button', { name: 'Label' }));
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('should not call onClick when disabled', async () => {
            const onClick = vi.fn();
            render(
                <ListItemAction onClick={onClick} disabled>
                    Label
                </ListItemAction>,
            );
            const button = screen.getByRole('button', { name: 'Label' });
            await userEvent.click(button);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should forward ref to button element', () => {
            const ref = React.createRef<HTMLButtonElement>();
            render(<ListItemAction ref={ref}>Label</ListItemAction>);
            expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        });

        it('should forward ref to anchor element', () => {
            const ref = React.createRef<HTMLAnchorElement>();
            render(
                <ListItemAction as="a" href="#" ref={ref}>
                    Label
                </ListItemAction>,
            );
            expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
        });
    });
});
