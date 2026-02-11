import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import BaseDividerTests, { setup } from '@lumx/core/js/components/Divider/Tests';
import { DividerProps } from '@lumx/core/js/components/Divider';

import { Theme } from '@lumx/react';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

const CLASSNAME = Divider.className as string;

describe(`<${Divider.displayName}>`, () => {
    // Adapter for core tests
    const renderDivider = (props: DividerProps, options?: SetupRenderOptions) => {
        return render(<Divider {...props} />, options);
    };

    // Run core tests
    BaseDividerTests({ render: renderDivider, screen });

    const setupDivider = (props: Partial<DividerProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderDivider, screen });

    describe('React-specific', () => {
        it('should render with default theme from context', () => {
            const { divider } = setupDivider();
            expect(divider).toBeInTheDocument();
            expect(divider).toHaveClass(CLASSNAME);
            expect(divider).toHaveClass(`${CLASSNAME}--theme-light`);
        });

        it('should render dark Theme', () => {
            const { divider } = setupDivider({ theme: Theme.dark });
            expect(divider).toHaveClass(`${CLASSNAME}--theme-dark`);
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setupDivider, {
        baseClassName: CLASSNAME,
        forwardClassName: 'divider',
        forwardAttributes: 'divider',
        forwardRef: 'divider',
        applyTheme: {
            affects: [{ element: 'divider' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
