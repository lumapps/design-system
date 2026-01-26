import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSentinel } from '@lumx/react/testing/utils/ThemeSentinel';
import { vi } from 'vitest';
import { Popover, PopoverProps } from './Popover';

const CLASSNAME = Popover.className as string;

const setup = (props: Partial<PopoverProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(
        <Popover isOpen anchorRef={{ current: null }} usePortal={false} {...props} data-testid="popover">
            {props.children || (
                <>
                    Popover content
                    <ThemeSentinel />
                </>
            )}
        </Popover>,
        { wrapper },
    );
    const element = screen.getByTestId('popover');
    const themeSentinel = screen.getByTestId(ThemeSentinel.testId);
    return { props, container, element, themeSentinel };
};

describe(`<${Popover.displayName}>`, () => {
    it('should render in portal', () => {
        const { element } = setup({ usePortal: true });
        expect(element).toBeInTheDocument();
        expect(element).toHaveTextContent(/Popover content/);
        expect(element.parentElement).toBe(document.body);
    });

    it('should render inline', () => {
        const { element, container } = setup({ usePortal: false });
        expect(element).toBeInTheDocument();
        expect(element).toHaveTextContent(/Popover content/);
        expect(element.parentElement).toBe(container);
    });

    it('should render with custom component', () => {
        const { element } = setup({ as: 'span' });
        expect(element).toBeInTheDocument();
        expect(element.tagName).toBe('SPAN');
    });

    describe('Props', () => {
        it('should render arrow', () => {
            const { element } = setup({ hasArrow: true });
            expect(element.querySelector(`.${CLASSNAME}__arrow`)).toBeInTheDocument();
        });

        it('should apply elevation', () => {
            const { element } = setup({ elevation: 5 });
            expect(element).toHaveClass(`${CLASSNAME}--elevation-5`);
        });

        it('should apply zIndex', () => {
            const { element } = setup({ zIndex: 1234 });
            expect(element).toHaveStyle('z-index: 1234');
        });

        it('should close on escape', () => {
            const onClose = vi.fn();
            setup({ isOpen: true, onClose, closeOnEscape: true });
            fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });
            expect(onClose).toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        applyTheme: {
            affects: [
                { element: 'element' },
                // Theme automatically transferred to the children
                { element: 'themeSentinel' },
            ],
            viaProp: true,
            // Parent context does not affect the popover
            viaContext: false,
        },
    });
});
