import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import React from 'react';
import { ListItemAction } from './ListItemAction';

const ACTION_CLASS = 'lumx-action-area__action';
const OVERLAY_CLASS = 'lumx-action-area__action--has-overlay';
const FOCUS_INSET_CLASS = 'lumx-action-area__action--focus-inset';

describe(`<${ListItemAction.displayName}>`, () => {
    describe('Rendering', () => {
        it('should render as a button by default', () => {
            render(<ListItemAction>Label</ListItemAction>);
            const button = screen.getByRole('button', { name: 'Label' });
            expect(button).toBeInTheDocument();
            expect(button.tagName).toBe('BUTTON');
        });

        it('should render as an anchor when as="a"', () => {
            render(
                <ListItemAction as="a" href="/test">
                    Link label
                </ListItemAction>,
            );
            const link = screen.getByRole('link', { name: 'Link label' });
            expect(link).toBeInTheDocument();
            expect(link.tagName).toBe('A');
            expect(link).toHaveAttribute('href', '/test');
        });

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
    });

    describe('Action area classes', () => {
        it('should apply action area action class', () => {
            render(<ListItemAction>Label</ListItemAction>);
            const button = screen.getByRole('button', { name: 'Label' });
            expect(button).toHaveClass(ACTION_CLASS);
        });

        it('should apply has-overlay modifier', () => {
            render(<ListItemAction>Label</ListItemAction>);
            const button = screen.getByRole('button', { name: 'Label' });
            expect(button).toHaveClass(OVERLAY_CLASS);
        });

        it('should apply focus-inset modifier', () => {
            render(<ListItemAction>Label</ListItemAction>);
            const button = screen.getByRole('button', { name: 'Label' });
            expect(button).toHaveClass(FOCUS_INSET_CLASS);
        });

        it('should merge custom className with action area classes', () => {
            render(<ListItemAction className="my-custom-class">Label</ListItemAction>);
            const button = screen.getByRole('button', { name: 'Label' });
            expect(button).toHaveClass('my-custom-class');
            expect(button).toHaveClass(ACTION_CLASS);
        });
    });

    describe('Click handling', () => {
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
    });

    describe('Ref forwarding', () => {
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

    describe('Props forwarding', () => {
        it('should forward native anchor props', () => {
            render(
                <ListItemAction as="a" href="https://example.com" target="_blank" rel="noopener noreferrer">
                    Label
                </ListItemAction>,
            );
            const link = screen.getByRole('link', { name: 'Label' });
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('should forward data attributes', () => {
            render(<ListItemAction data-testid="action">Label</ListItemAction>);
            expect(screen.getByTestId('action')).toBeInTheDocument();
        });

        it('should forward aria attributes', () => {
            render(<ListItemAction aria-label="Custom label">Label</ListItemAction>);
            expect(screen.getByRole('button', { name: 'Custom label' })).toBeInTheDocument();
        });
    });
});
