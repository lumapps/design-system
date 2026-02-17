import { render, screen } from '@testing-library/vue';
import BaseToolbarTests, { setup } from '@lumx/core/js/components/Toolbar/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Toolbar';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Toolbar } from '.';

describe('<Toolbar />', () => {
    const renderToolbar = ({ label, before, after, ...props }: any, options?: SetupRenderOptions<any>) => {
        const slots: Record<string, any> = {};
        if (label !== undefined) slots.default = label;
        if (before !== undefined) slots.before = before;
        if (after !== undefined) slots.after = after;

        return render(Toolbar, {
            ...options,
            props,
            slots: Object.keys(slots).length > 0 ? slots : undefined,
        });
    };

    // Run core tests
    BaseToolbarTests({
        render: renderToolbar,
        screen,
    });

    const setupToolbar = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderToolbar, screen });

    // Vue-specific tests
    describe('Vue', () => {
        it('should render content in slots', () => {
            const { container } = render(Toolbar, {
                slots: {
                    before: '<span data-testid="before">Before</span>',
                    default: '<span data-testid="label">Label</span>',
                    after: '<span data-testid="after">After</span>',
                },
            });

            expect(screen.getByTestId('before')).toBeInTheDocument();
            expect(screen.getByTestId('label')).toBeInTheDocument();
            expect(screen.getByTestId('after')).toBeInTheDocument();

            const beforeWrapper = container.querySelector(`.${CLASSNAME}__before`);
            const labelWrapper = container.querySelector(`.${CLASSNAME}__label`);
            const afterWrapper = container.querySelector(`.${CLASSNAME}__after`);

            expect(beforeWrapper).toBeInTheDocument();
            expect(labelWrapper).toBeInTheDocument();
            expect(afterWrapper).toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupToolbar, {
        baseClassName: CLASSNAME,
        forwardClassName: 'div',
        forwardAttributes: 'div',
        forwardRef: 'div',
    });
});
