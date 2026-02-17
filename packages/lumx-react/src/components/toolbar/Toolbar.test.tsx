import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import BaseToolbarTests from '@lumx/core/js/components/Toolbar/Tests';
import { Toolbar, ToolbarProps } from './Toolbar';

const CLASSNAME = Toolbar.className as string;

const setup = (props: Partial<ToolbarProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(<Toolbar {...(props as any)} />, { wrapper });
    const element = getByClassName(container, CLASSNAME);
    return { props, container, element };
};

describe(`<${Toolbar.displayName}>`, () => {
    // Run core tests
    BaseToolbarTests({
        render: (props: ToolbarProps) => render(<Toolbar {...props} />),
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should render content elements', () => {
            setup({
                before: <span data-testid="before">Before</span>,
                label: <span data-testid="label">Label</span>,
                after: <span data-testid="after">After</span>,
            });

            expect(screen.getByTestId('before')).toBeInTheDocument();
            expect(screen.getByTestId('label')).toBeInTheDocument();
            expect(screen.getByTestId('after')).toBeInTheDocument();

            const beforeWrapper = document.querySelector(`.${CLASSNAME}__before`);
            const labelWrapper = document.querySelector(`.${CLASSNAME}__label`);
            const afterWrapper = document.querySelector(`.${CLASSNAME}__after`);

            expect(beforeWrapper).toBeInTheDocument();
            expect(labelWrapper).toBeInTheDocument();
            expect(afterWrapper).toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
