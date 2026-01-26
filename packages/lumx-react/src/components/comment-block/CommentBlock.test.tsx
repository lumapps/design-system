import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { render, screen, fireEvent } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { vi } from 'vitest';
import { CommentBlock, CommentBlockProps } from './CommentBlock';

const CLASSNAME = CommentBlock.className as string;

const setup = (props: Partial<CommentBlockProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<CommentBlock {...(props as any)} />, { wrapper });
    const commentBlock = queryByClassName(document.body, CLASSNAME);
    return { props, commentBlock };
};

describe(`<${CommentBlock.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'commentBlock',
        forwardAttributes: 'commentBlock',
        applyTheme: {
            affects: [{ element: 'commentBlock' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });

    describe('Rendering', () => {
        it('should render content correctly', () => {
            setup({
                name: 'John Doe',
                date: '1 hour ago',
                text: 'This is a comment',
                actions: <button type="submit">Reply</button>,
                hasActions: true,
            });

            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('1 hour ago')).toBeInTheDocument();
            expect(screen.getByText('This is a comment')).toBeInTheDocument();
            expect(screen.getByText('Reply')).toBeInTheDocument();
        });

        it('should render children when open', () => {
            setup({
                isOpen: true,
                children: <div data-testid="child">Child Reply</div>,
            });
            expect(screen.getByTestId('child')).toBeInTheDocument();
        });

        it('should not render children when closed', () => {
            setup({
                isOpen: false,
                children: <div data-testid="child">Child Reply</div>,
            });
            expect(screen.queryByTestId('child')).not.toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('should trigger onClick when clicking name', () => {
            const onClick = vi.fn();
            setup({ name: 'John Doe', onClick });
            fireEvent.click(screen.getByText('John Doe'));
            expect(onClick).toHaveBeenCalled();
        });

        it('should trigger onMouseEnter/Leave when hovering name', () => {
            const onMouseEnter = vi.fn();
            const onMouseLeave = vi.fn();
            setup({ name: 'John Doe', onMouseEnter, onMouseLeave });

            fireEvent.mouseEnter(screen.getByText('John Doe'));
            expect(onMouseEnter).toHaveBeenCalled();

            fireEvent.mouseLeave(screen.getByText('John Doe'));
            expect(onMouseLeave).toHaveBeenCalled();
        });
    });
});
