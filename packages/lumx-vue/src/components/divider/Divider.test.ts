import { render, screen } from '@testing-library/vue';

import BaseDividerTests from '@lumx/core/js/components/Divider/Tests';
import { CLASSNAME, DividerProps } from '@lumx/core/js/components/Divider';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Divider } from '.';

describe('<Divider />', () => {
    const renderDivider = (props: DividerProps, options?: SetupRenderOptions<DividerProps>) =>
        render(Divider, { props, ...options });

    BaseDividerTests({ render: renderDivider, screen });

    const setupDivider = (props: Partial<DividerProps> = {}, options: SetupRenderOptions<DividerProps> = {}) => {
        const result = render(Divider, {
            props,
            ...options,
        });

        const divider = result.container.querySelector(`.${CLASSNAME}`) as HTMLElement;

        return { divider, props };
    };

    describe('Vue', () => {
        it('should render with default theme from context', () => {
            const { divider } = setupDivider();
            expect(divider).toBeInTheDocument();
            expect(divider).toHaveClass(CLASSNAME);
            expect(divider).toHaveClass(`${CLASSNAME}--theme-light`);
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setupDivider, {
        baseClassName: CLASSNAME,
        forwardClassName: 'divider',
        forwardAttributes: 'divider',
        applyTheme: {
            affects: [{ element: 'divider' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
