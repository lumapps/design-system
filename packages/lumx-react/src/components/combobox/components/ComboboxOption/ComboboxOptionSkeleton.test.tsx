import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Size } from '@lumx/react';
import { REAL_SIZE_FOR_LUMX_SIZE } from '@lumx/core/js/constants';

import { ComboboxOptionSkeleton } from './ComboboxOptionSkeleton';
import { COMBOBOX_OPTION_CLASSNAME } from './index';

const CLASSNAME = COMBOBOX_OPTION_CLASSNAME;

/**
 * Mounts the component and returns common DOM elements
 */
const setup = (props: any = {}) => {
    const result = render(
        <ul>
            <ComboboxOptionSkeleton {...props} />
        </ul>,
    );

    const listItem = result.container.querySelector('li');

    return {
        ...result,
        listItem,
    };
};

describe('<ComboboxOptionSkeleton>', () => {
    describe('Rendering', () => {
        it('should render with default props', () => {
            const { listItem } = setup();
            expect(listItem).toBeInTheDocument();
            expect(listItem).toHaveAttribute('role', 'presentation');
        });

        it('should render with skeleton class', () => {
            const { listItem } = setup();
            expect(listItem).toHaveClass(`${CLASSNAME}--skeleton`);
        });

        it('should render with list item class', () => {
            const { listItem } = setup();
            expect(listItem).toHaveClass('lumx-list-item');
        });

        it('should render with default SkeletonTypography', () => {
            const { container } = setup();
            const skeleton = container.querySelector('.lumx-skeleton-typography');
            expect(skeleton).toBeInTheDocument();
        });
    });

    describe('Props', () => {
        it('should apply custom className', () => {
            const { listItem } = setup({ className: 'custom-class' });
            expect(listItem).toHaveClass('custom-class');
        });

        it('should apply default size (tiny)', () => {
            const { listItem } = setup();
            expect(listItem).toHaveClass('lumx-list-item--size-tiny');
        });

        it('should apply custom size', () => {
            const { listItem } = setup({ size: Size.big });
            expect(listItem).toHaveClass('lumx-list-item--size-big');
        });

        it('should apply s size', () => {
            const { listItem } = setup({ size: Size.s });
            expect(listItem).toHaveClass('lumx-list-item--size-s');
        });

        it('should apply medium size', () => {
            const { listItem } = setup({ size: Size.medium });
            expect(listItem).toHaveClass('lumx-list-item--size-medium');
        });

        it('should apply huge size', () => {
            const { listItem } = setup({ size: Size.huge });
            expect(listItem).toHaveClass('lumx-list-item--size-huge');
        });
    });

    describe('Index-based width', () => {
        it('should use xxl width for index 0', () => {
            const { container } = setup({ index: 0 });
            const skeleton = container.querySelector('.lumx-skeleton-typography');
            expect(skeleton).toHaveStyle({ width: `${REAL_SIZE_FOR_LUMX_SIZE.xxl}px` });
        });

        it('should use xl width for index 1', () => {
            const { container } = setup({ index: 1 });
            const skeleton = container.querySelector('.lumx-skeleton-typography');
            expect(skeleton).toHaveStyle({ width: `${REAL_SIZE_FOR_LUMX_SIZE.xl}px` });
        });

        it('should use l width for index 2', () => {
            const { container } = setup({ index: 2 });
            const skeleton = container.querySelector('.lumx-skeleton-typography');
            expect(skeleton).toHaveStyle({ width: `${REAL_SIZE_FOR_LUMX_SIZE.l}px` });
        });

        it('should use default xl width for index 3 (out of bounds)', () => {
            const { container } = setup({ index: 3 });
            const skeleton = container.querySelector('.lumx-skeleton-typography');
            expect(skeleton).toHaveStyle({ width: `${REAL_SIZE_FOR_LUMX_SIZE.xl}px` });
        });

        it('should use default xl width when no index is provided', () => {
            const { container } = setup();
            const skeleton = container.querySelector('.lumx-skeleton-typography');
            expect(skeleton).toHaveStyle({ width: `${REAL_SIZE_FOR_LUMX_SIZE.xl}px` });
        });
    });

    describe('Children', () => {
        it('should render static children instead of default skeleton', () => {
            setup({ children: <span data-testid="custom-content">Custom Content</span> });
            expect(screen.getByTestId('custom-content')).toBeInTheDocument();
            expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
        });

        it('should render text children', () => {
            setup({ children: 'Text Content' });
            expect(screen.getByText('Text Content')).toBeInTheDocument();
        });

        it('should render function children with index', () => {
            const childrenFn = vi.fn(({ index }) => <span data-testid="function-child">Index: {index}</span>);
            setup({ children: childrenFn, index: 5 });

            expect(childrenFn).toHaveBeenCalledWith({ index: 5 });
            expect(screen.getByTestId('function-child')).toBeInTheDocument();
            expect(screen.getByText('Index: 5')).toBeInTheDocument();
        });

        it('should render function children without index', () => {
            const childrenFn = vi.fn(({ index }) => (
                <span data-testid="function-child">Index: {index ?? 'undefined'}</span>
            ));
            setup({ children: childrenFn });

            expect(childrenFn).toHaveBeenCalledWith({ index: undefined });
            expect(screen.getByTestId('function-child')).toBeInTheDocument();
        });

        it('should not render default skeleton when children is provided', () => {
            const { container } = setup({ children: <span>Custom</span> });
            const skeleton = container.querySelector('.lumx-skeleton-typography');
            expect(skeleton).not.toBeInTheDocument();
        });
    });

    describe('Before content', () => {
        it('should render before content', () => {
            setup({ before: <span data-testid="before-content">Before</span> });
            expect(screen.getByTestId('before-content')).toBeInTheDocument();
        });

        it('should apply before classes', () => {
            setup({ before: <span data-testid="before-content">Before</span> });
            const beforeElement = screen.getByTestId('before-content').closest(`.${CLASSNAME}__before`);
            expect(beforeElement).toBeInTheDocument();
            expect(beforeElement).toHaveClass('lumx-list-item__before');
        });

        it('should not render before element when before is not provided', () => {
            const { container } = setup();
            const beforeElement = container.querySelector(`.${CLASSNAME}__before`);
            expect(beforeElement).not.toBeInTheDocument();
        });

        it('should render before with Text component wrapper', () => {
            const { container } = setup({ before: <span data-testid="before-content">Before</span> });
            const beforeElement = container.querySelector(`.${CLASSNAME}__before`);
            expect(beforeElement).toHaveAttribute('role', 'presentation');
            expect(beforeElement?.tagName).toBe('SPAN');
        });
    });

    describe('After content', () => {
        it('should render after content', () => {
            setup({ after: <span data-testid="after-content">After</span> });
            expect(screen.getByTestId('after-content')).toBeInTheDocument();
        });

        it('should apply after classes', () => {
            setup({ after: <span data-testid="after-content">After</span> });
            const afterElement = screen.getByTestId('after-content').closest(`.${CLASSNAME}__after`);
            expect(afterElement).toBeInTheDocument();
            expect(afterElement).toHaveClass('lumx-list-item__after');
        });

        it('should not render after element when after is not provided', () => {
            const { container } = setup();
            const afterElement = container.querySelector(`.${CLASSNAME}__after`);
            expect(afterElement).not.toBeInTheDocument();
        });

        it('should render after with div wrapper', () => {
            setup({ after: <span data-testid="after-content">After</span> });
            const afterWrapper = screen.getByTestId('after-content').closest('div');
            expect(afterWrapper).toHaveAttribute('role', 'presentation');
        });
    });

    describe('Combined props', () => {
        it('should render with all props combined', () => {
            const { listItem } = setup({
                className: 'custom-skeleton',
                index: 1,
                size: Size.medium,
                before: <span data-testid="before">B</span>,
                after: <span data-testid="after">A</span>,
                children: <span data-testid="content">Content</span>,
            });

            expect(listItem).toHaveClass('custom-skeleton');
            expect(listItem).toHaveClass('lumx-list-item--size-medium');
            expect(screen.getByTestId('before')).toBeInTheDocument();
            expect(screen.getByTestId('after')).toBeInTheDocument();
            expect(screen.getByTestId('content')).toBeInTheDocument();
        });

        it('should render with before, after, and default skeleton', () => {
            const { container } = setup({
                before: <span data-testid="before">B</span>,
                after: <span data-testid="after">A</span>,
            });

            expect(screen.getByTestId('before')).toBeInTheDocument();
            expect(screen.getByTestId('after')).toBeInTheDocument();
            expect(container.querySelector('.lumx-skeleton-typography')).toBeInTheDocument();
        });
    });

    describe('Content wrapper', () => {
        it('should render content wrapper with correct classes', () => {
            const { container } = setup();
            const contentWrapper = container.querySelector(`.${CLASSNAME}__content`);
            expect(contentWrapper).toBeInTheDocument();
            expect(contentWrapper).toHaveClass('lumx-list-item__wrapper');
            expect(contentWrapper).toHaveAttribute('role', 'presentation');
        });

        it('should contain before and skeleton in content wrapper', () => {
            const { container } = setup({ before: <span data-testid="before">B</span> });
            const contentWrapper = container.querySelector(`.${CLASSNAME}__content`);
            const beforeElement = screen.getByTestId('before').closest(`.${CLASSNAME}__before`) as HTMLElement;
            const skeleton = container.querySelector('.lumx-skeleton-typography') as HTMLElement;

            expect(contentWrapper).toContainElement(beforeElement);
            expect(contentWrapper).toContainElement(skeleton);
        });

        it('should not contain after in content wrapper', () => {
            const { container } = setup({ after: <span data-testid="after">A</span> });
            const contentWrapper = container.querySelector(`.${CLASSNAME}__content`);
            const afterElement = screen.getByTestId('after').closest(`.${CLASSNAME}__after`) as HTMLElement;

            expect(contentWrapper).not.toContainElement(afterElement);
        });
    });
});
